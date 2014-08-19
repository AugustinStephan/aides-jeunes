package integration;

import java.io.IOException;
import java.util.ArrayList;

import models.Individu;
import models.Individu.Civilite;
import models.Individu.IndividuRole;
import models.Individu.Nationalite;
import models.Individu.StatutMarital;
import models.Logement;
import models.Logement.LogementConjoint;
import models.Logement.LogementType;
import models.Situation;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.junit.Test;

import pdfwriter.PdfWriter;
import controllers.Application.Forms;
import formfiller.FormFiller;

public class IntegrationTest {

    @Test
    public void testAllForms_PartialSituation() throws IOException {
        fillAllFormsWithSituation(createIncompleteSituation());
    }

    @Test
    public void testAllForms_PartialSituationIncludingConjoint() throws IOException {
        fillAllFormsWithSituation(createIncompleteSituationIncludingConjoint());
    }

    @Test
    public void testAllForms_CompleteSituation() throws IOException {
        fillAllFormsWithSituation(createCompleteSituation());
    }

    private void fillAllFormsWithSituation(Situation situation) throws IOException {
        for (Forms form : Forms.values()) {
            FormFiller formFiller = form.createFormFiller();
            formFiller.setSituation(situation);
            PDDocument document = PDDocument.load(String.format("resources/%s.pdf", form.id));
            PdfWriter writer = new PdfWriter(document);
            formFiller.setWriter(writer);
            formFiller.fill();
        }
    }

    /**
     * Crée une situation dont seuls les champs obligatoires sont remplis.
     */
    private Situation createIncompleteSituation() {
        Situation situation = new Situation();
        situation.individus = new ArrayList<>();
        Individu demandeur = createIncompleteIndividu();
        demandeur.role = IndividuRole.DEMANDEUR;
        situation.individus.add(demandeur);
        situation.logement = new Logement();
        situation.logement.type = LogementType.GRATUIT;
        situation.logement.codePostal = "75011";

        return situation;
    }

    private Situation createIncompleteSituationIncludingConjoint() {
        Situation situation = createIncompleteSituation();
        Individu conjoint = createIncompleteIndividu();
        conjoint.role = IndividuRole.CONJOINT;
        situation.individus.add(conjoint);

        return situation;
    }

    private Individu createIncompleteIndividu() {
        Individu individu = new Individu();
        individu.dateDeNaissance = "14/09/1989";
        individu.nationalite = Nationalite.FRANCAISE;

        return individu;
    }

    private Situation createCompleteSituation() {
        Situation situation = createIncompleteSituationIncludingConjoint();
        situation.email = "prenom.nom@gmail.com";
        situation.phoneNumber = "0685644221";

        situation.logement.adresse = "10 avenue du Général de Gaulle";
        situation.logement.dateArrivee = "12/07/2009";
        situation.logement.ville = "Paris";
        situation.logement.type = LogementType.LOCATAIRE;
        situation.logement.loyer = 450;

        situation.logement.conjointMemeAdresse = false;
        LogementConjoint logementConjoint = new LogementConjoint();
        situation.logement.conjoint = logementConjoint;
        logementConjoint.adresse = "12 avenue des Champs-Elysées";
        logementConjoint.codePostal = "32256";
        logementConjoint.ville = "Montluchon";
        logementConjoint.pays = "France";

        Individu demandeur = situation.individus.get(0);
        fillIndividu(demandeur);
        Individu conjoint = situation.individus.get(1);
        fillIndividu(conjoint);

        return situation;
    }

    private void fillIndividu(Individu individu) {
        individu.civilite = Civilite.HOMME;
        individu.firstName = "Bernard";
        individu.lastName = "Dupont";
        individu.nomUsage = "Martin";
        individu.villeNaissance = "Montluçon";
        individu.paysNaissance = "France";
        individu.departementNaissance = 67;
        individu.nir = "189090909090909";
        individu.statusMarital = StatutMarital.MARIAGE;
        individu.dateSituationFamiliale = "12/07/2009";
        individu.demandeurEmploi = true;
        individu.enceinte = true;
        individu.etudiant = true;
        individu.inscritCaf = true;
        individu.numeroAllocataire = "1234567";
    }
}
