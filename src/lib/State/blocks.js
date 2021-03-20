const Individu = require('@/lib/Individu').default;
const Ressource = require('@/lib/Ressource').default;
const { datesGenerator } = require('../../../backend/lib/mes-aides');

function Step({key, entity, id, variable}) {
  this.fullPath = entity ? `/simulation/${entity}${id ? `/${id}` : ''}${variable ? `/${variable}` : ''}` : '/'
  this.key = key || this.fullPath
  this.entity = entity
  this.id = id
  this.variable = variable
}

function ComplexStep({route, key, entity, id, variable, defaults}) {
  Step.call(this, {route, key, entity, id, variable})
  this.defaults = defaults
}
ComplexStep.prototype = Object.create(Step.prototype)

function individuBlockFactory(id) {
  const r = variable => new Step({entity: 'individu', id, variable})
  const conjoint = id == 'conjoint'
  const demandeur = id == 'demandeur'
  const enfant = id.startsWith('enfant')
  return {
    subject: situation => situation[id] || situation.enfants.find(enfant => enfant.id === id) || {},
    steps: [
      ...(enfant ? [r('_firstName')] : []),
      r('date_naissance'),
      r('nationalite'),
      ...(conjoint ? [r('statut_marital')] : []),
      ...(enfant ? [r('garde_alternee')] : []),
      ...(!enfant ? [r('activite')] : []),
      r('handicap'),
      {
        isActive: subject => subject.handicap,
        steps: [
          r('taux_incapacite'),
          {
            isActive: subject => !enfant && 0.5 <= subject.taux_incapacite && subject.taux_incapacite < 0.8,
            steps: [
              r('aah_restriction_substantielle_durable_acces_emploi'),
            ]
          }
        ]
      },
      ...(!enfant ? [
        r('inapte_travail'),
        {
          isActive: subject => subject.activite == 'chomeur',
          steps: [
            r('date_debut_chomage'),
            r('ass_precondition_remplie')
          ]
        }
      ] : []),
      ...(enfant ? [{
        isActive: subject => subject.handicap,
        steps: [
          r('enfant_place'),
        ]
      }] : []),
      {
        isActive: subject => subject.activite == 'etudiant',
        steps: [r('echelon_bourse')]
      },
      ...(demandeur ? [{
        isActive: (subject, situation) => {
          const age = Individu.age(subject, datesGenerator(situation.dateDeValeur).today.value);
          return 8 < age && age <= 25
        },
        steps: [r('enfant_a_charge')]
      }] : []),
      ...(enfant ? [{
        isActive: (subject, situation) => {
          const age = Individu.age(subject, datesGenerator(situation.dateDeValeur).today.value);
          return 8 < age && age <= 25
        },
        steps: [r('scolarite')]
      }] : []),
      ...(enfant ? [r('enfant_a_charge')] : []),
      ...(demandeur ? [{
        isActive: (subject, situation) => 60 <= Individu.age(subject, datesGenerator(situation.dateDeValeur).today.value),
        steps: [r('gir')]
      }] : [])
    ]
  }
}

function kidBlock(situation) {
  return {
    steps: [
      new Step({entity: 'enfants'}),
      ...(situation.enfants.length ? (situation.enfants.map(e => {
        return {
          steps: [individuBlockFactory(e.id), new Step({entity: 'enfants', key:`enfants#${e.id}`})]
        }
      })) : [])
    ]
  }
}

function housingBlock() {
  return {
    subject: situation => situation.menage,
    steps: [
      new Step({entity: 'logement'}),
      {
        isActive: subject => !subject.statut_occupation_logement || subject.statut_occupation_logement.startsWith("locataire"),
        steps: [
          new Step({entity: 'menage', variable: 'coloc'}),
          new Step({entity: 'menage', variable: 'logement_chambre'}),
          new Step({entity: 'famille', variable: 'proprietaire_proche_famille'}),
        ]
     },
     {
        isActive: subject => {
          const locataire = (! subject.statut_occupation_logement) || subject.statut_occupation_logement.startsWith("locataire")
          const proprietaire = subject.statut_occupation_logement && (subject.statut_occupation_logement === 'primo_accedant' || subject.statut_occupation_logement === 'proprietaire')
          return locataire || proprietaire
        },
        steps: [
          new ComplexStep({entity: 'menage', variable: 'loyer'}),
        ]
     },
     {
        isActive: subject => subject.statut_occupation_logement == "loge_gratuitement",
        steps: [
          new Step({entity: 'menage', variable: 'participation_frais'}),
          new Step({entity: 'individu', id: 'demandeur', variable: 'habite_chez_parents'}),
        ]
     },
     new Step({entity: 'menage', variable: 'depcom'}),
     {
        isActive: subject => subject.depcom && subject.depcom.startsWith('75'),
        steps: [
          new Step({entity: 'famille', variable: 'parisien'}),
        ],
     }
    ]
  }
}

function resourceBlocks(situation) {
  const individuResourceBlock = (individuId) => {
    const individu = situation[individuId] || situation.enfants.find(enfant => enfant.id === individuId) || {}
    return {
      steps: [
        new ComplexStep({entity: 'individu', id: individuId, variable: 'ressources/types'})
      ].concat(
          Ressource.getIndividuRessourceCategories(individu).map(category => `/simulation/individu/${individuId}/ressources/montants/${category}`)
      )
    }
  }
  return {
    steps: [
      individuResourceBlock('demandeur'),
      ...(situation.conjoint ? [individuResourceBlock('conjoint')] : []),
      ...(situation.enfants.length ? [new Step({entity:'enfants', variable: 'ressources'})] : []),
      {
        steps: situation.enfants.map(e => {
          return e._hasRessources ? individuResourceBlock(e.id) : {steps: []}
        })
      }
    ]
  }
}

function generateBlocks(situation) {
  return [
    {steps: [new Step({})]},
    individuBlockFactory('demandeur'),
    kidBlock(situation),
    {
      steps: [
        new Step({entity: 'famille', variable: 'en_couple'}),
        {
          isActive: (situation) => situation.enfants && situation.enfants.length && !situation.famille.en_couple,
          steps: [
            new Step({entity: 'famille', variable: 'rsa_isolement_recent'}),
          ]
        },
        ...(situation.conjoint ? [individuBlockFactory('conjoint')] : []),
      ]
    },
    housingBlock(situation),
    resourceBlocks(situation),
    {
      steps: [
        new Step({entity: 'resultats'}),
        new Step({entity: 'resultats'})
      ]
    }
  ]
}

module.exports = {
  generateBlocks,
  Step,
  ComplexStep,
}
