package com.techxel.buntu.domain;

import com.techxel.buntu.domain.enumeration.Etat;
import com.techxel.buntu.domain.enumeration.ModeDePaiement;
import com.techxel.buntu.domain.enumeration.Papier;
import com.techxel.buntu.domain.enumeration.PeriodeDePaiement;
import com.techxel.buntu.domain.enumeration.Transaction;
import com.techxel.buntu.domain.enumeration.TypeDeBien;
import java.io.Serializable;
import java.time.LocalDate;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Propriete.
 */
@Entity
@Table(name = "propriete")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Propriete implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "reference", unique = true)
    private String reference;

    @Enumerated(EnumType.STRING)
    @Column(name = "type")
    private TypeDeBien type;

    @Enumerated(EnumType.STRING)
    @Column(name = "mode_de_transaction")
    private Transaction modeDeTransaction;

    @Enumerated(EnumType.STRING)
    @Column(name = "etat")
    private Etat etat;

    @Lob
    @Column(name = "description")
    private String description;

    @Column(name = "prix")
    private Double prix;

    @Column(name = "adresse")
    private String adresse;

    @Size(max = 80)
    @Column(name = "adresse_tronque", length = 80)
    private String adresseTronque;

    @Column(name = "latitude")
    private Double latitude;

    @Column(name = "longitude")
    private Double longitude;

    @Column(name = "superficie")
    private Double superficie;

    @Min(value = 1900)
    @Column(name = "annee_de_construction")
    private Integer anneeDeConstruction;

    @Column(name = "nombre_de_pieces")
    private Integer nombreDePieces;

    @Column(name = "nombre_de_douches")
    private Integer nombreDeDouches;

    @Column(name = "nombre_de_garages")
    private Integer nombreDeGarages;

    @Enumerated(EnumType.STRING)
    @Column(name = "mode_de_paiement")
    private ModeDePaiement modeDePaiement;

    @Enumerated(EnumType.STRING)
    @Column(name = "papier")
    private Papier papier;

    @Column(name = "acce_eelectricite")
    private Boolean acceEelectricite;

    @Column(name = "acces_eau")
    private Boolean accesEau;

    @Column(name = "acces_adsl")
    private Boolean accesADSL;

    @Column(name = "meuble")
    private Boolean meuble;

    @Column(name = "en_promo")
    private LocalDate enPromo;

    @Enumerated(EnumType.STRING)
    @Column(name = "periode")
    private PeriodeDePaiement periode;

    @Column(name = "distance_primaire")
    private Double distancePrimaire;

    @Column(name = "distance_secondaire")
    private Double distanceSecondaire;

    @Column(name = "distance_lycee")
    private Double distanceLycee;

    @Column(name = "distancehopital")
    private Double distancehopital;

    @Column(name = "distanceclinique")
    private Double distanceclinique;

    @Column(name = "url_photo_principale")
    private String urlPhotoPrincipale;

    @Column(name = "url_photo_1")
    private String urlPhoto1;

    @Column(name = "url_photo_2")
    private String urlPhoto2;

    @Column(name = "url_photo_3")
    private String urlPhoto3;

    @Column(name = "url_photo_4")
    private String urlPhoto4;

    @Column(name = "url_photo_5")
    private String urlPhoto5;

    @Column(name = "url_photo_6")
    private String urlPhoto6;

    @Column(name = "url_video")
    private String urlVideo;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Propriete id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getReference() {
        return this.reference;
    }

    public Propriete reference(String reference) {
        this.setReference(reference);
        return this;
    }

    public void setReference(String reference) {
        this.reference = reference;
    }

    public TypeDeBien getType() {
        return this.type;
    }

    public Propriete type(TypeDeBien type) {
        this.setType(type);
        return this;
    }

    public void setType(TypeDeBien type) {
        this.type = type;
    }

    public Transaction getModeDeTransaction() {
        return this.modeDeTransaction;
    }

    public Propriete modeDeTransaction(Transaction modeDeTransaction) {
        this.setModeDeTransaction(modeDeTransaction);
        return this;
    }

    public void setModeDeTransaction(Transaction modeDeTransaction) {
        this.modeDeTransaction = modeDeTransaction;
    }

    public Etat getEtat() {
        return this.etat;
    }

    public Propriete etat(Etat etat) {
        this.setEtat(etat);
        return this;
    }

    public void setEtat(Etat etat) {
        this.etat = etat;
    }

    public String getDescription() {
        return this.description;
    }

    public Propriete description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getPrix() {
        return this.prix;
    }

    public Propriete prix(Double prix) {
        this.setPrix(prix);
        return this;
    }

    public void setPrix(Double prix) {
        this.prix = prix;
    }

    public String getAdresse() {
        return this.adresse;
    }

    public Propriete adresse(String adresse) {
        this.setAdresse(adresse);
        return this;
    }

    public void setAdresse(String adresse) {
        this.adresse = adresse;
    }

    public String getAdresseTronque() {
        return this.adresseTronque;
    }

    public Propriete adresseTronque(String adresseTronque) {
        this.setAdresseTronque(adresseTronque);
        return this;
    }

    public void setAdresseTronque(String adresseTronque) {
        this.adresseTronque = adresseTronque;
    }

    public Double getLatitude() {
        return this.latitude;
    }

    public Propriete latitude(Double latitude) {
        this.setLatitude(latitude);
        return this;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return this.longitude;
    }

    public Propriete longitude(Double longitude) {
        this.setLongitude(longitude);
        return this;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public Double getSuperficie() {
        return this.superficie;
    }

    public Propriete superficie(Double superficie) {
        this.setSuperficie(superficie);
        return this;
    }

    public void setSuperficie(Double superficie) {
        this.superficie = superficie;
    }

    public Integer getAnneeDeConstruction() {
        return this.anneeDeConstruction;
    }

    public Propriete anneeDeConstruction(Integer anneeDeConstruction) {
        this.setAnneeDeConstruction(anneeDeConstruction);
        return this;
    }

    public void setAnneeDeConstruction(Integer anneeDeConstruction) {
        this.anneeDeConstruction = anneeDeConstruction;
    }

    public Integer getNombreDePieces() {
        return this.nombreDePieces;
    }

    public Propriete nombreDePieces(Integer nombreDePieces) {
        this.setNombreDePieces(nombreDePieces);
        return this;
    }

    public void setNombreDePieces(Integer nombreDePieces) {
        this.nombreDePieces = nombreDePieces;
    }

    public Integer getNombreDeDouches() {
        return this.nombreDeDouches;
    }

    public Propriete nombreDeDouches(Integer nombreDeDouches) {
        this.setNombreDeDouches(nombreDeDouches);
        return this;
    }

    public void setNombreDeDouches(Integer nombreDeDouches) {
        this.nombreDeDouches = nombreDeDouches;
    }

    public Integer getNombreDeGarages() {
        return this.nombreDeGarages;
    }

    public Propriete nombreDeGarages(Integer nombreDeGarages) {
        this.setNombreDeGarages(nombreDeGarages);
        return this;
    }

    public void setNombreDeGarages(Integer nombreDeGarages) {
        this.nombreDeGarages = nombreDeGarages;
    }

    public ModeDePaiement getModeDePaiement() {
        return this.modeDePaiement;
    }

    public Propriete modeDePaiement(ModeDePaiement modeDePaiement) {
        this.setModeDePaiement(modeDePaiement);
        return this;
    }

    public void setModeDePaiement(ModeDePaiement modeDePaiement) {
        this.modeDePaiement = modeDePaiement;
    }

    public Papier getPapier() {
        return this.papier;
    }

    public Propriete papier(Papier papier) {
        this.setPapier(papier);
        return this;
    }

    public void setPapier(Papier papier) {
        this.papier = papier;
    }

    public Boolean getAcceEelectricite() {
        return this.acceEelectricite;
    }

    public Propriete acceEelectricite(Boolean acceEelectricite) {
        this.setAcceEelectricite(acceEelectricite);
        return this;
    }

    public void setAcceEelectricite(Boolean acceEelectricite) {
        this.acceEelectricite = acceEelectricite;
    }

    public Boolean getAccesEau() {
        return this.accesEau;
    }

    public Propriete accesEau(Boolean accesEau) {
        this.setAccesEau(accesEau);
        return this;
    }

    public void setAccesEau(Boolean accesEau) {
        this.accesEau = accesEau;
    }

    public Boolean getAccesADSL() {
        return this.accesADSL;
    }

    public Propriete accesADSL(Boolean accesADSL) {
        this.setAccesADSL(accesADSL);
        return this;
    }

    public void setAccesADSL(Boolean accesADSL) {
        this.accesADSL = accesADSL;
    }

    public Boolean getMeuble() {
        return this.meuble;
    }

    public Propriete meuble(Boolean meuble) {
        this.setMeuble(meuble);
        return this;
    }

    public void setMeuble(Boolean meuble) {
        this.meuble = meuble;
    }

    public LocalDate getEnPromo() {
        return this.enPromo;
    }

    public Propriete enPromo(LocalDate enPromo) {
        this.setEnPromo(enPromo);
        return this;
    }

    public void setEnPromo(LocalDate enPromo) {
        this.enPromo = enPromo;
    }

    public PeriodeDePaiement getPeriode() {
        return this.periode;
    }

    public Propriete periode(PeriodeDePaiement periode) {
        this.setPeriode(periode);
        return this;
    }

    public void setPeriode(PeriodeDePaiement periode) {
        this.periode = periode;
    }

    public Double getDistancePrimaire() {
        return this.distancePrimaire;
    }

    public Propriete distancePrimaire(Double distancePrimaire) {
        this.setDistancePrimaire(distancePrimaire);
        return this;
    }

    public void setDistancePrimaire(Double distancePrimaire) {
        this.distancePrimaire = distancePrimaire;
    }

    public Double getDistanceSecondaire() {
        return this.distanceSecondaire;
    }

    public Propriete distanceSecondaire(Double distanceSecondaire) {
        this.setDistanceSecondaire(distanceSecondaire);
        return this;
    }

    public void setDistanceSecondaire(Double distanceSecondaire) {
        this.distanceSecondaire = distanceSecondaire;
    }

    public Double getDistanceLycee() {
        return this.distanceLycee;
    }

    public Propriete distanceLycee(Double distanceLycee) {
        this.setDistanceLycee(distanceLycee);
        return this;
    }

    public void setDistanceLycee(Double distanceLycee) {
        this.distanceLycee = distanceLycee;
    }

    public Double getDistancehopital() {
        return this.distancehopital;
    }

    public Propriete distancehopital(Double distancehopital) {
        this.setDistancehopital(distancehopital);
        return this;
    }

    public void setDistancehopital(Double distancehopital) {
        this.distancehopital = distancehopital;
    }

    public Double getDistanceclinique() {
        return this.distanceclinique;
    }

    public Propriete distanceclinique(Double distanceclinique) {
        this.setDistanceclinique(distanceclinique);
        return this;
    }

    public void setDistanceclinique(Double distanceclinique) {
        this.distanceclinique = distanceclinique;
    }

    public String getUrlPhotoPrincipale() {
        return this.urlPhotoPrincipale;
    }

    public Propriete urlPhotoPrincipale(String urlPhotoPrincipale) {
        this.setUrlPhotoPrincipale(urlPhotoPrincipale);
        return this;
    }

    public void setUrlPhotoPrincipale(String urlPhotoPrincipale) {
        this.urlPhotoPrincipale = urlPhotoPrincipale;
    }

    public String getUrlPhoto1() {
        return this.urlPhoto1;
    }

    public Propriete urlPhoto1(String urlPhoto1) {
        this.setUrlPhoto1(urlPhoto1);
        return this;
    }

    public void setUrlPhoto1(String urlPhoto1) {
        this.urlPhoto1 = urlPhoto1;
    }

    public String getUrlPhoto2() {
        return this.urlPhoto2;
    }

    public Propriete urlPhoto2(String urlPhoto2) {
        this.setUrlPhoto2(urlPhoto2);
        return this;
    }

    public void setUrlPhoto2(String urlPhoto2) {
        this.urlPhoto2 = urlPhoto2;
    }

    public String getUrlPhoto3() {
        return this.urlPhoto3;
    }

    public Propriete urlPhoto3(String urlPhoto3) {
        this.setUrlPhoto3(urlPhoto3);
        return this;
    }

    public void setUrlPhoto3(String urlPhoto3) {
        this.urlPhoto3 = urlPhoto3;
    }

    public String getUrlPhoto4() {
        return this.urlPhoto4;
    }

    public Propriete urlPhoto4(String urlPhoto4) {
        this.setUrlPhoto4(urlPhoto4);
        return this;
    }

    public void setUrlPhoto4(String urlPhoto4) {
        this.urlPhoto4 = urlPhoto4;
    }

    public String getUrlPhoto5() {
        return this.urlPhoto5;
    }

    public Propriete urlPhoto5(String urlPhoto5) {
        this.setUrlPhoto5(urlPhoto5);
        return this;
    }

    public void setUrlPhoto5(String urlPhoto5) {
        this.urlPhoto5 = urlPhoto5;
    }

    public String getUrlPhoto6() {
        return this.urlPhoto6;
    }

    public Propriete urlPhoto6(String urlPhoto6) {
        this.setUrlPhoto6(urlPhoto6);
        return this;
    }

    public void setUrlPhoto6(String urlPhoto6) {
        this.urlPhoto6 = urlPhoto6;
    }

    public String getUrlVideo() {
        return this.urlVideo;
    }

    public Propriete urlVideo(String urlVideo) {
        this.setUrlVideo(urlVideo);
        return this;
    }

    public void setUrlVideo(String urlVideo) {
        this.urlVideo = urlVideo;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Propriete)) {
            return false;
        }
        return id != null && id.equals(((Propriete) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Propriete{" +
            "id=" + getId() +
            ", reference='" + getReference() + "'" +
            ", type='" + getType() + "'" +
            ", modeDeTransaction='" + getModeDeTransaction() + "'" +
            ", etat='" + getEtat() + "'" +
            ", description='" + getDescription() + "'" +
            ", prix=" + getPrix() +
            ", adresse='" + getAdresse() + "'" +
            ", adresseTronque='" + getAdresseTronque() + "'" +
            ", latitude=" + getLatitude() +
            ", longitude=" + getLongitude() +
            ", superficie=" + getSuperficie() +
            ", anneeDeConstruction=" + getAnneeDeConstruction() +
            ", nombreDePieces=" + getNombreDePieces() +
            ", nombreDeDouches=" + getNombreDeDouches() +
            ", nombreDeGarages=" + getNombreDeGarages() +
            ", modeDePaiement='" + getModeDePaiement() + "'" +
            ", papier='" + getPapier() + "'" +
            ", acceEelectricite='" + getAcceEelectricite() + "'" +
            ", accesEau='" + getAccesEau() + "'" +
            ", accesADSL='" + getAccesADSL() + "'" +
            ", meuble='" + getMeuble() + "'" +
            ", enPromo='" + getEnPromo() + "'" +
            ", periode='" + getPeriode() + "'" +
            ", distancePrimaire=" + getDistancePrimaire() +
            ", distanceSecondaire=" + getDistanceSecondaire() +
            ", distanceLycee=" + getDistanceLycee() +
            ", distancehopital=" + getDistancehopital() +
            ", distanceclinique=" + getDistanceclinique() +
            ", urlPhotoPrincipale='" + getUrlPhotoPrincipale() + "'" +
            ", urlPhoto1='" + getUrlPhoto1() + "'" +
            ", urlPhoto2='" + getUrlPhoto2() + "'" +
            ", urlPhoto3='" + getUrlPhoto3() + "'" +
            ", urlPhoto4='" + getUrlPhoto4() + "'" +
            ", urlPhoto5='" + getUrlPhoto5() + "'" +
            ", urlPhoto6='" + getUrlPhoto6() + "'" +
            ", urlVideo='" + getUrlVideo() + "'" +
            "}";
    }
}
