'use strict';

const logementTypes = [
    {
        id: 'locataire',
        label: 'locataire',
        hint: 'figurant sur le bail ou en foyer ou en résidence'
    },
    {
        id: 'proprietaire',
        label: 'propriétaire',
        hint: 'ou en location-accession'
    },
    {
        id: 'heberge',
        label: 'hébergé',
        hint: 'chez un particulier ou en logement de fonction'
    },
    {
        id: 'sansDomicile',
        label: 'sans domicile stable',
        hint: 'ou domiciliation administrative'
    }
]

const locationTypes = [
    {
        id: 'nonmeuble',
        label: 'non meublé'
    },
    {
        id: 'meublehotel',
        label: 'meublé / hôtel'
    },
    {
        id: 'foyer',
        label: 'Foyer (résidence universitaire, foyer de jeune travailleur, résidence sociale…)'
    }
]

module.exports = {
    logementTypes,
    locationTypes,
}
