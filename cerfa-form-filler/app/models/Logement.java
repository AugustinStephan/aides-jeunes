package models;

import java.io.IOException;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;

public class Logement {

    public String adresse;
    public String codePostal;
    public String ville;
    public LogementType type;

    @JsonDeserialize(using = LogementTypeDeserializer.class)
    public static enum LogementType {

        LOCATAIRE("locataire"),
        PROPRIETAIRE("proprietaire"),
        GRATUIT("gratuit");

        public final String jsonValue;

        LogementType(String jsonValue) {
            this.jsonValue = jsonValue;
        }
    }

    public static class LogementTypeDeserializer extends JsonDeserializer<LogementType> {

        @Override
        public LogementType deserialize(JsonParser jp, DeserializationContext ctxt) throws IOException, JsonProcessingException {
            for (LogementType type : LogementType.values()) {
                if (type.jsonValue.equals(jp.getText())) {
                    return type;
                }
            }

            throw new RuntimeException(String.format("Type de logement inconnu : %s", jp.getText()));
        }
    }
}
