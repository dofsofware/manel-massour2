package com.techxel.buntu.service.dto;

public class EmailDTO {

    private String email;
    private String sujet;
    private String contenu;

    public EmailDTO() {}

    public EmailDTO(String email, String sujet, String contenu) {
        this.email = email;
        this.sujet = sujet;
        this.contenu = contenu;
    }

    public String getContenu() {
        return contenu;
    }

    public void setContenu(String contenu) {
        this.contenu = contenu;
    }

    public String getSujet() {
        return sujet;
    }

    public void setSujet(String sujet) {
        this.sujet = sujet;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
