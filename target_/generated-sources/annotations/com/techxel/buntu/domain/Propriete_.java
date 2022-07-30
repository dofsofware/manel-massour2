package com.techxel.buntu.domain;

import com.techxel.buntu.domain.enumeration.Etat;
import com.techxel.buntu.domain.enumeration.ModeDePaiement;
import com.techxel.buntu.domain.enumeration.Papier;
import com.techxel.buntu.domain.enumeration.PeriodeDePaiement;
import com.techxel.buntu.domain.enumeration.Transaction;
import com.techxel.buntu.domain.enumeration.TypeDeBien;
import java.time.LocalDate;
import javax.annotation.Generated;
import javax.persistence.metamodel.SingularAttribute;
import javax.persistence.metamodel.StaticMetamodel;

@Generated(value = "org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
@StaticMetamodel(Propriete.class)
public abstract class Propriete_ {

	public static volatile SingularAttribute<Propriete, LocalDate> enPromo;
	public static volatile SingularAttribute<Propriete, Double> prix;
	public static volatile SingularAttribute<Propriete, Integer> nombreDeGarages;
	public static volatile SingularAttribute<Propriete, String> urlPhotoPrincipale;
	public static volatile SingularAttribute<Propriete, Double> latitude;
	public static volatile SingularAttribute<Propriete, String> description;
	public static volatile SingularAttribute<Propriete, TypeDeBien> type;
	public static volatile SingularAttribute<Propriete, String> urlPhoto6;
	public static volatile SingularAttribute<Propriete, Transaction> modeDeTransaction;
	public static volatile SingularAttribute<Propriete, Etat> etat;
	public static volatile SingularAttribute<Propriete, String> urlPhoto5;
	public static volatile SingularAttribute<Propriete, String> urlPhoto4;
	public static volatile SingularAttribute<Propriete, PeriodeDePaiement> periode;
	public static volatile SingularAttribute<Propriete, String> urlPhoto3;
	public static volatile SingularAttribute<Propriete, String> reference;
	public static volatile SingularAttribute<Propriete, Integer> nombreDeDouches;
	public static volatile SingularAttribute<Propriete, String> urlPhoto2;
	public static volatile SingularAttribute<Propriete, String> adresseTronque;
	public static volatile SingularAttribute<Propriete, String> urlPhoto1;
	public static volatile SingularAttribute<Propriete, Double> distancehopital;
	public static volatile SingularAttribute<Propriete, Integer> anneeDeConstruction;
	public static volatile SingularAttribute<Propriete, Boolean> meuble;
	public static volatile SingularAttribute<Propriete, Long> id;
	public static volatile SingularAttribute<Propriete, Double> distanceSecondaire;
	public static volatile SingularAttribute<Propriete, Double> longitude;
	public static volatile SingularAttribute<Propriete, String> urlVideo;
	public static volatile SingularAttribute<Propriete, Boolean> accesEau;
	public static volatile SingularAttribute<Propriete, Double> distancePrimaire;
	public static volatile SingularAttribute<Propriete, ModeDePaiement> modeDePaiement;
	public static volatile SingularAttribute<Propriete, Double> distanceLycee;
	public static volatile SingularAttribute<Propriete, Double> distanceclinique;
	public static volatile SingularAttribute<Propriete, Integer> nombreDePieces;
	public static volatile SingularAttribute<Propriete, Boolean> acceEelectricite;
	public static volatile SingularAttribute<Propriete, Double> superficie;
	public static volatile SingularAttribute<Propriete, String> adresse;
	public static volatile SingularAttribute<Propriete, Boolean> accesADSL;
	public static volatile SingularAttribute<Propriete, Papier> papier;

	public static final String EN_PROMO = "enPromo";
	public static final String PRIX = "prix";
	public static final String NOMBRE_DE_GARAGES = "nombreDeGarages";
	public static final String URL_PHOTO_PRINCIPALE = "urlPhotoPrincipale";
	public static final String LATITUDE = "latitude";
	public static final String DESCRIPTION = "description";
	public static final String TYPE = "type";
	public static final String URL_PHOTO6 = "urlPhoto6";
	public static final String MODE_DE_TRANSACTION = "modeDeTransaction";
	public static final String ETAT = "etat";
	public static final String URL_PHOTO5 = "urlPhoto5";
	public static final String URL_PHOTO4 = "urlPhoto4";
	public static final String PERIODE = "periode";
	public static final String URL_PHOTO3 = "urlPhoto3";
	public static final String REFERENCE = "reference";
	public static final String NOMBRE_DE_DOUCHES = "nombreDeDouches";
	public static final String URL_PHOTO2 = "urlPhoto2";
	public static final String ADRESSE_TRONQUE = "adresseTronque";
	public static final String URL_PHOTO1 = "urlPhoto1";
	public static final String DISTANCEHOPITAL = "distancehopital";
	public static final String ANNEE_DE_CONSTRUCTION = "anneeDeConstruction";
	public static final String MEUBLE = "meuble";
	public static final String ID = "id";
	public static final String DISTANCE_SECONDAIRE = "distanceSecondaire";
	public static final String LONGITUDE = "longitude";
	public static final String URL_VIDEO = "urlVideo";
	public static final String ACCES_EAU = "accesEau";
	public static final String DISTANCE_PRIMAIRE = "distancePrimaire";
	public static final String MODE_DE_PAIEMENT = "modeDePaiement";
	public static final String DISTANCE_LYCEE = "distanceLycee";
	public static final String DISTANCECLINIQUE = "distanceclinique";
	public static final String NOMBRE_DE_PIECES = "nombreDePieces";
	public static final String ACCE_EELECTRICITE = "acceEelectricite";
	public static final String SUPERFICIE = "superficie";
	public static final String ADRESSE = "adresse";
	public static final String ACCES_AD_SL = "accesADSL";
	public static final String PAPIER = "papier";

}

