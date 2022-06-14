package com.techxel.buntu.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.techxel.buntu.IntegrationTest;
import com.techxel.buntu.domain.Propriete;
import com.techxel.buntu.domain.enumeration.Etat;
import com.techxel.buntu.domain.enumeration.ModeDePaiement;
import com.techxel.buntu.domain.enumeration.Papier;
import com.techxel.buntu.domain.enumeration.PeriodeDePaiement;
import com.techxel.buntu.domain.enumeration.Transaction;
import com.techxel.buntu.domain.enumeration.TypeDeBien;
import com.techxel.buntu.repository.ProprieteRepository;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Base64Utils;

/**
 * Integration tests for the {@link ProprieteResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ProprieteResourceIT {

    private static final String DEFAULT_REFERENCE = "AAAAAAAAAA";
    private static final String UPDATED_REFERENCE = "BBBBBBBBBB";

    private static final TypeDeBien DEFAULT_TYPE = TypeDeBien.TERRAIN;
    private static final TypeDeBien UPDATED_TYPE = TypeDeBien.MAISON;

    private static final Transaction DEFAULT_MODE_DE_TRANSACTION = Transaction.VENDRE;
    private static final Transaction UPDATED_MODE_DE_TRANSACTION = Transaction.LOCATION;

    private static final Etat DEFAULT_ETAT = Etat.NEUF;
    private static final Etat UPDATED_ETAT = Etat.OCCASION;

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final Double DEFAULT_PRIX = 1D;
    private static final Double UPDATED_PRIX = 2D;

    private static final String DEFAULT_ADRESSE = "AAAAAAAAAA";
    private static final String UPDATED_ADRESSE = "BBBBBBBBBB";

    private static final String DEFAULT_ADRESSE_TRONQUE = "AAAAAAAAAA";
    private static final String UPDATED_ADRESSE_TRONQUE = "BBBBBBBBBB";

    private static final Double DEFAULT_LATITUDE = 1D;
    private static final Double UPDATED_LATITUDE = 2D;

    private static final Double DEFAULT_LONGITUDE = 1D;
    private static final Double UPDATED_LONGITUDE = 2D;

    private static final Double DEFAULT_SUPERFICIE = 1D;
    private static final Double UPDATED_SUPERFICIE = 2D;

    private static final Integer DEFAULT_ANNEE_DE_CONSTRUCTION = 1900;
    private static final Integer UPDATED_ANNEE_DE_CONSTRUCTION = 1901;

    private static final Integer DEFAULT_NOMBRE_DE_PIECES = 1;
    private static final Integer UPDATED_NOMBRE_DE_PIECES = 2;

    private static final Integer DEFAULT_NOMBRE_DE_DOUCHES = 1;
    private static final Integer UPDATED_NOMBRE_DE_DOUCHES = 2;

    private static final Integer DEFAULT_NOMBRE_DE_GARAGES = 1;
    private static final Integer UPDATED_NOMBRE_DE_GARAGES = 2;

    private static final ModeDePaiement DEFAULT_MODE_DE_PAIEMENT = ModeDePaiement.COMPTANT;
    private static final ModeDePaiement UPDATED_MODE_DE_PAIEMENT = ModeDePaiement.MORATOIRE;

    private static final Papier DEFAULT_PAPIER = Papier.TITRE_FONCIER;
    private static final Papier UPDATED_PAPIER = Papier.BAIL;

    private static final Boolean DEFAULT_ACCE_EELECTRICITE = false;
    private static final Boolean UPDATED_ACCE_EELECTRICITE = true;

    private static final Boolean DEFAULT_ACCES_EAU = false;
    private static final Boolean UPDATED_ACCES_EAU = true;

    private static final Boolean DEFAULT_ACCES_ADSL = false;
    private static final Boolean UPDATED_ACCES_ADSL = true;

    private static final Boolean DEFAULT_MEUBLE = false;
    private static final Boolean UPDATED_MEUBLE = true;

    private static final LocalDate DEFAULT_EN_PROMO = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_EN_PROMO = LocalDate.now(ZoneId.systemDefault());

    private static final PeriodeDePaiement DEFAULT_PERIODE = PeriodeDePaiement.JOUR;
    private static final PeriodeDePaiement UPDATED_PERIODE = PeriodeDePaiement.SEMAINE;

    private static final Double DEFAULT_DISTANCE_PRIMAIRE = 1D;
    private static final Double UPDATED_DISTANCE_PRIMAIRE = 2D;

    private static final Double DEFAULT_DISTANCE_SECONDAIRE = 1D;
    private static final Double UPDATED_DISTANCE_SECONDAIRE = 2D;

    private static final Double DEFAULT_DISTANCE_LYCEE = 1D;
    private static final Double UPDATED_DISTANCE_LYCEE = 2D;

    private static final Double DEFAULT_DISTANCEHOPITAL = 1D;
    private static final Double UPDATED_DISTANCEHOPITAL = 2D;

    private static final Double DEFAULT_DISTANCECLINIQUE = 1D;
    private static final Double UPDATED_DISTANCECLINIQUE = 2D;

    private static final String DEFAULT_URL_PHOTO_PRINCIPALE = "AAAAAAAAAA";
    private static final String UPDATED_URL_PHOTO_PRINCIPALE = "BBBBBBBBBB";

    private static final String DEFAULT_URL_PHOTO_1 = "AAAAAAAAAA";
    private static final String UPDATED_URL_PHOTO_1 = "BBBBBBBBBB";

    private static final String DEFAULT_URL_PHOTO_2 = "AAAAAAAAAA";
    private static final String UPDATED_URL_PHOTO_2 = "BBBBBBBBBB";

    private static final String DEFAULT_URL_PHOTO_3 = "AAAAAAAAAA";
    private static final String UPDATED_URL_PHOTO_3 = "BBBBBBBBBB";

    private static final String DEFAULT_URL_PHOTO_4 = "AAAAAAAAAA";
    private static final String UPDATED_URL_PHOTO_4 = "BBBBBBBBBB";

    private static final String DEFAULT_URL_PHOTO_5 = "AAAAAAAAAA";
    private static final String UPDATED_URL_PHOTO_5 = "BBBBBBBBBB";

    private static final String DEFAULT_URL_PHOTO_6 = "AAAAAAAAAA";
    private static final String UPDATED_URL_PHOTO_6 = "BBBBBBBBBB";

    private static final String DEFAULT_URL_VIDEO = "AAAAAAAAAA";
    private static final String UPDATED_URL_VIDEO = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/proprietes";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ProprieteRepository proprieteRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restProprieteMockMvc;

    private Propriete propriete;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Propriete createEntity(EntityManager em) {
        Propriete propriete = new Propriete()
            .reference(DEFAULT_REFERENCE)
            .type(DEFAULT_TYPE)
            .modeDeTransaction(DEFAULT_MODE_DE_TRANSACTION)
            .etat(DEFAULT_ETAT)
            .description(DEFAULT_DESCRIPTION)
            .prix(DEFAULT_PRIX)
            .adresse(DEFAULT_ADRESSE)
            .adresseTronque(DEFAULT_ADRESSE_TRONQUE)
            .latitude(DEFAULT_LATITUDE)
            .longitude(DEFAULT_LONGITUDE)
            .superficie(DEFAULT_SUPERFICIE)
            .anneeDeConstruction(DEFAULT_ANNEE_DE_CONSTRUCTION)
            .nombreDePieces(DEFAULT_NOMBRE_DE_PIECES)
            .nombreDeDouches(DEFAULT_NOMBRE_DE_DOUCHES)
            .nombreDeGarages(DEFAULT_NOMBRE_DE_GARAGES)
            .modeDePaiement(DEFAULT_MODE_DE_PAIEMENT)
            .papier(DEFAULT_PAPIER)
            .acceEelectricite(DEFAULT_ACCE_EELECTRICITE)
            .accesEau(DEFAULT_ACCES_EAU)
            .accesADSL(DEFAULT_ACCES_ADSL)
            .meuble(DEFAULT_MEUBLE)
            .enPromo(DEFAULT_EN_PROMO)
            .periode(DEFAULT_PERIODE)
            .distancePrimaire(DEFAULT_DISTANCE_PRIMAIRE)
            .distanceSecondaire(DEFAULT_DISTANCE_SECONDAIRE)
            .distanceLycee(DEFAULT_DISTANCE_LYCEE)
            .distancehopital(DEFAULT_DISTANCEHOPITAL)
            .distanceclinique(DEFAULT_DISTANCECLINIQUE)
            .urlPhotoPrincipale(DEFAULT_URL_PHOTO_PRINCIPALE)
            .urlPhoto1(DEFAULT_URL_PHOTO_1)
            .urlPhoto2(DEFAULT_URL_PHOTO_2)
            .urlPhoto3(DEFAULT_URL_PHOTO_3)
            .urlPhoto4(DEFAULT_URL_PHOTO_4)
            .urlPhoto5(DEFAULT_URL_PHOTO_5)
            .urlPhoto6(DEFAULT_URL_PHOTO_6)
            .urlVideo(DEFAULT_URL_VIDEO);
        return propriete;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Propriete createUpdatedEntity(EntityManager em) {
        Propriete propriete = new Propriete()
            .reference(UPDATED_REFERENCE)
            .type(UPDATED_TYPE)
            .modeDeTransaction(UPDATED_MODE_DE_TRANSACTION)
            .etat(UPDATED_ETAT)
            .description(UPDATED_DESCRIPTION)
            .prix(UPDATED_PRIX)
            .adresse(UPDATED_ADRESSE)
            .adresseTronque(UPDATED_ADRESSE_TRONQUE)
            .latitude(UPDATED_LATITUDE)
            .longitude(UPDATED_LONGITUDE)
            .superficie(UPDATED_SUPERFICIE)
            .anneeDeConstruction(UPDATED_ANNEE_DE_CONSTRUCTION)
            .nombreDePieces(UPDATED_NOMBRE_DE_PIECES)
            .nombreDeDouches(UPDATED_NOMBRE_DE_DOUCHES)
            .nombreDeGarages(UPDATED_NOMBRE_DE_GARAGES)
            .modeDePaiement(UPDATED_MODE_DE_PAIEMENT)
            .papier(UPDATED_PAPIER)
            .acceEelectricite(UPDATED_ACCE_EELECTRICITE)
            .accesEau(UPDATED_ACCES_EAU)
            .accesADSL(UPDATED_ACCES_ADSL)
            .meuble(UPDATED_MEUBLE)
            .enPromo(UPDATED_EN_PROMO)
            .periode(UPDATED_PERIODE)
            .distancePrimaire(UPDATED_DISTANCE_PRIMAIRE)
            .distanceSecondaire(UPDATED_DISTANCE_SECONDAIRE)
            .distanceLycee(UPDATED_DISTANCE_LYCEE)
            .distancehopital(UPDATED_DISTANCEHOPITAL)
            .distanceclinique(UPDATED_DISTANCECLINIQUE)
            .urlPhotoPrincipale(UPDATED_URL_PHOTO_PRINCIPALE)
            .urlPhoto1(UPDATED_URL_PHOTO_1)
            .urlPhoto2(UPDATED_URL_PHOTO_2)
            .urlPhoto3(UPDATED_URL_PHOTO_3)
            .urlPhoto4(UPDATED_URL_PHOTO_4)
            .urlPhoto5(UPDATED_URL_PHOTO_5)
            .urlPhoto6(UPDATED_URL_PHOTO_6)
            .urlVideo(UPDATED_URL_VIDEO);
        return propriete;
    }

    @BeforeEach
    public void initTest() {
        propriete = createEntity(em);
    }

    @Test
    @Transactional
    void createPropriete() throws Exception {
        int databaseSizeBeforeCreate = proprieteRepository.findAll().size();
        // Create the Propriete
        restProprieteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(propriete)))
            .andExpect(status().isCreated());

        // Validate the Propriete in the database
        List<Propriete> proprieteList = proprieteRepository.findAll();
        assertThat(proprieteList).hasSize(databaseSizeBeforeCreate + 1);
        Propriete testPropriete = proprieteList.get(proprieteList.size() - 1);
        assertThat(testPropriete.getReference()).isEqualTo(DEFAULT_REFERENCE);
        assertThat(testPropriete.getType()).isEqualTo(DEFAULT_TYPE);
        assertThat(testPropriete.getModeDeTransaction()).isEqualTo(DEFAULT_MODE_DE_TRANSACTION);
        assertThat(testPropriete.getEtat()).isEqualTo(DEFAULT_ETAT);
        assertThat(testPropriete.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testPropriete.getPrix()).isEqualTo(DEFAULT_PRIX);
        assertThat(testPropriete.getAdresse()).isEqualTo(DEFAULT_ADRESSE);
        assertThat(testPropriete.getAdresseTronque()).isEqualTo(DEFAULT_ADRESSE_TRONQUE);
        assertThat(testPropriete.getLatitude()).isEqualTo(DEFAULT_LATITUDE);
        assertThat(testPropriete.getLongitude()).isEqualTo(DEFAULT_LONGITUDE);
        assertThat(testPropriete.getSuperficie()).isEqualTo(DEFAULT_SUPERFICIE);
        assertThat(testPropriete.getAnneeDeConstruction()).isEqualTo(DEFAULT_ANNEE_DE_CONSTRUCTION);
        assertThat(testPropriete.getNombreDePieces()).isEqualTo(DEFAULT_NOMBRE_DE_PIECES);
        assertThat(testPropriete.getNombreDeDouches()).isEqualTo(DEFAULT_NOMBRE_DE_DOUCHES);
        assertThat(testPropriete.getNombreDeGarages()).isEqualTo(DEFAULT_NOMBRE_DE_GARAGES);
        assertThat(testPropriete.getModeDePaiement()).isEqualTo(DEFAULT_MODE_DE_PAIEMENT);
        assertThat(testPropriete.getPapier()).isEqualTo(DEFAULT_PAPIER);
        assertThat(testPropriete.getAcceEelectricite()).isEqualTo(DEFAULT_ACCE_EELECTRICITE);
        assertThat(testPropriete.getAccesEau()).isEqualTo(DEFAULT_ACCES_EAU);
        assertThat(testPropriete.getAccesADSL()).isEqualTo(DEFAULT_ACCES_ADSL);
        assertThat(testPropriete.getMeuble()).isEqualTo(DEFAULT_MEUBLE);
        assertThat(testPropriete.getEnPromo()).isEqualTo(DEFAULT_EN_PROMO);
        assertThat(testPropriete.getPeriode()).isEqualTo(DEFAULT_PERIODE);
        assertThat(testPropriete.getDistancePrimaire()).isEqualTo(DEFAULT_DISTANCE_PRIMAIRE);
        assertThat(testPropriete.getDistanceSecondaire()).isEqualTo(DEFAULT_DISTANCE_SECONDAIRE);
        assertThat(testPropriete.getDistanceLycee()).isEqualTo(DEFAULT_DISTANCE_LYCEE);
        assertThat(testPropriete.getDistancehopital()).isEqualTo(DEFAULT_DISTANCEHOPITAL);
        assertThat(testPropriete.getDistanceclinique()).isEqualTo(DEFAULT_DISTANCECLINIQUE);
        assertThat(testPropriete.getUrlPhotoPrincipale()).isEqualTo(DEFAULT_URL_PHOTO_PRINCIPALE);
        assertThat(testPropriete.getUrlPhoto1()).isEqualTo(DEFAULT_URL_PHOTO_1);
        assertThat(testPropriete.getUrlPhoto2()).isEqualTo(DEFAULT_URL_PHOTO_2);
        assertThat(testPropriete.getUrlPhoto3()).isEqualTo(DEFAULT_URL_PHOTO_3);
        assertThat(testPropriete.getUrlPhoto4()).isEqualTo(DEFAULT_URL_PHOTO_4);
        assertThat(testPropriete.getUrlPhoto5()).isEqualTo(DEFAULT_URL_PHOTO_5);
        assertThat(testPropriete.getUrlPhoto6()).isEqualTo(DEFAULT_URL_PHOTO_6);
        assertThat(testPropriete.getUrlVideo()).isEqualTo(DEFAULT_URL_VIDEO);
    }

    @Test
    @Transactional
    void createProprieteWithExistingId() throws Exception {
        // Create the Propriete with an existing ID
        propriete.setId(1L);

        int databaseSizeBeforeCreate = proprieteRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restProprieteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(propriete)))
            .andExpect(status().isBadRequest());

        // Validate the Propriete in the database
        List<Propriete> proprieteList = proprieteRepository.findAll();
        assertThat(proprieteList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllProprietes() throws Exception {
        // Initialize the database
        proprieteRepository.saveAndFlush(propriete);

        // Get all the proprieteList
        restProprieteMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(propriete.getId().intValue())))
            .andExpect(jsonPath("$.[*].reference").value(hasItem(DEFAULT_REFERENCE)))
            .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE.toString())))
            .andExpect(jsonPath("$.[*].modeDeTransaction").value(hasItem(DEFAULT_MODE_DE_TRANSACTION.toString())))
            .andExpect(jsonPath("$.[*].etat").value(hasItem(DEFAULT_ETAT.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())))
            .andExpect(jsonPath("$.[*].prix").value(hasItem(DEFAULT_PRIX.doubleValue())))
            .andExpect(jsonPath("$.[*].adresse").value(hasItem(DEFAULT_ADRESSE)))
            .andExpect(jsonPath("$.[*].adresseTronque").value(hasItem(DEFAULT_ADRESSE_TRONQUE)))
            .andExpect(jsonPath("$.[*].latitude").value(hasItem(DEFAULT_LATITUDE.doubleValue())))
            .andExpect(jsonPath("$.[*].longitude").value(hasItem(DEFAULT_LONGITUDE.doubleValue())))
            .andExpect(jsonPath("$.[*].superficie").value(hasItem(DEFAULT_SUPERFICIE.doubleValue())))
            .andExpect(jsonPath("$.[*].anneeDeConstruction").value(hasItem(DEFAULT_ANNEE_DE_CONSTRUCTION)))
            .andExpect(jsonPath("$.[*].nombreDePieces").value(hasItem(DEFAULT_NOMBRE_DE_PIECES)))
            .andExpect(jsonPath("$.[*].nombreDeDouches").value(hasItem(DEFAULT_NOMBRE_DE_DOUCHES)))
            .andExpect(jsonPath("$.[*].nombreDeGarages").value(hasItem(DEFAULT_NOMBRE_DE_GARAGES)))
            .andExpect(jsonPath("$.[*].modeDePaiement").value(hasItem(DEFAULT_MODE_DE_PAIEMENT.toString())))
            .andExpect(jsonPath("$.[*].papier").value(hasItem(DEFAULT_PAPIER.toString())))
            .andExpect(jsonPath("$.[*].acceEelectricite").value(hasItem(DEFAULT_ACCE_EELECTRICITE.booleanValue())))
            .andExpect(jsonPath("$.[*].accesEau").value(hasItem(DEFAULT_ACCES_EAU.booleanValue())))
            .andExpect(jsonPath("$.[*].accesADSL").value(hasItem(DEFAULT_ACCES_ADSL.booleanValue())))
            .andExpect(jsonPath("$.[*].meuble").value(hasItem(DEFAULT_MEUBLE.booleanValue())))
            .andExpect(jsonPath("$.[*].enPromo").value(hasItem(DEFAULT_EN_PROMO.toString())))
            .andExpect(jsonPath("$.[*].periode").value(hasItem(DEFAULT_PERIODE.toString())))
            .andExpect(jsonPath("$.[*].distancePrimaire").value(hasItem(DEFAULT_DISTANCE_PRIMAIRE.doubleValue())))
            .andExpect(jsonPath("$.[*].distanceSecondaire").value(hasItem(DEFAULT_DISTANCE_SECONDAIRE.doubleValue())))
            .andExpect(jsonPath("$.[*].distanceLycee").value(hasItem(DEFAULT_DISTANCE_LYCEE.doubleValue())))
            .andExpect(jsonPath("$.[*].distancehopital").value(hasItem(DEFAULT_DISTANCEHOPITAL.doubleValue())))
            .andExpect(jsonPath("$.[*].distanceclinique").value(hasItem(DEFAULT_DISTANCECLINIQUE.doubleValue())))
            .andExpect(jsonPath("$.[*].urlPhotoPrincipale").value(hasItem(DEFAULT_URL_PHOTO_PRINCIPALE)))
            .andExpect(jsonPath("$.[*].urlPhoto1").value(hasItem(DEFAULT_URL_PHOTO_1)))
            .andExpect(jsonPath("$.[*].urlPhoto2").value(hasItem(DEFAULT_URL_PHOTO_2)))
            .andExpect(jsonPath("$.[*].urlPhoto3").value(hasItem(DEFAULT_URL_PHOTO_3)))
            .andExpect(jsonPath("$.[*].urlPhoto4").value(hasItem(DEFAULT_URL_PHOTO_4)))
            .andExpect(jsonPath("$.[*].urlPhoto5").value(hasItem(DEFAULT_URL_PHOTO_5)))
            .andExpect(jsonPath("$.[*].urlPhoto6").value(hasItem(DEFAULT_URL_PHOTO_6)))
            .andExpect(jsonPath("$.[*].urlVideo").value(hasItem(DEFAULT_URL_VIDEO)));
    }

    @Test
    @Transactional
    void getPropriete() throws Exception {
        // Initialize the database
        proprieteRepository.saveAndFlush(propriete);

        // Get the propriete
        restProprieteMockMvc
            .perform(get(ENTITY_API_URL_ID, propriete.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(propriete.getId().intValue()))
            .andExpect(jsonPath("$.reference").value(DEFAULT_REFERENCE))
            .andExpect(jsonPath("$.type").value(DEFAULT_TYPE.toString()))
            .andExpect(jsonPath("$.modeDeTransaction").value(DEFAULT_MODE_DE_TRANSACTION.toString()))
            .andExpect(jsonPath("$.etat").value(DEFAULT_ETAT.toString()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()))
            .andExpect(jsonPath("$.prix").value(DEFAULT_PRIX.doubleValue()))
            .andExpect(jsonPath("$.adresse").value(DEFAULT_ADRESSE))
            .andExpect(jsonPath("$.adresseTronque").value(DEFAULT_ADRESSE_TRONQUE))
            .andExpect(jsonPath("$.latitude").value(DEFAULT_LATITUDE.doubleValue()))
            .andExpect(jsonPath("$.longitude").value(DEFAULT_LONGITUDE.doubleValue()))
            .andExpect(jsonPath("$.superficie").value(DEFAULT_SUPERFICIE.doubleValue()))
            .andExpect(jsonPath("$.anneeDeConstruction").value(DEFAULT_ANNEE_DE_CONSTRUCTION))
            .andExpect(jsonPath("$.nombreDePieces").value(DEFAULT_NOMBRE_DE_PIECES))
            .andExpect(jsonPath("$.nombreDeDouches").value(DEFAULT_NOMBRE_DE_DOUCHES))
            .andExpect(jsonPath("$.nombreDeGarages").value(DEFAULT_NOMBRE_DE_GARAGES))
            .andExpect(jsonPath("$.modeDePaiement").value(DEFAULT_MODE_DE_PAIEMENT.toString()))
            .andExpect(jsonPath("$.papier").value(DEFAULT_PAPIER.toString()))
            .andExpect(jsonPath("$.acceEelectricite").value(DEFAULT_ACCE_EELECTRICITE.booleanValue()))
            .andExpect(jsonPath("$.accesEau").value(DEFAULT_ACCES_EAU.booleanValue()))
            .andExpect(jsonPath("$.accesADSL").value(DEFAULT_ACCES_ADSL.booleanValue()))
            .andExpect(jsonPath("$.meuble").value(DEFAULT_MEUBLE.booleanValue()))
            .andExpect(jsonPath("$.enPromo").value(DEFAULT_EN_PROMO.toString()))
            .andExpect(jsonPath("$.periode").value(DEFAULT_PERIODE.toString()))
            .andExpect(jsonPath("$.distancePrimaire").value(DEFAULT_DISTANCE_PRIMAIRE.doubleValue()))
            .andExpect(jsonPath("$.distanceSecondaire").value(DEFAULT_DISTANCE_SECONDAIRE.doubleValue()))
            .andExpect(jsonPath("$.distanceLycee").value(DEFAULT_DISTANCE_LYCEE.doubleValue()))
            .andExpect(jsonPath("$.distancehopital").value(DEFAULT_DISTANCEHOPITAL.doubleValue()))
            .andExpect(jsonPath("$.distanceclinique").value(DEFAULT_DISTANCECLINIQUE.doubleValue()))
            .andExpect(jsonPath("$.urlPhotoPrincipale").value(DEFAULT_URL_PHOTO_PRINCIPALE))
            .andExpect(jsonPath("$.urlPhoto1").value(DEFAULT_URL_PHOTO_1))
            .andExpect(jsonPath("$.urlPhoto2").value(DEFAULT_URL_PHOTO_2))
            .andExpect(jsonPath("$.urlPhoto3").value(DEFAULT_URL_PHOTO_3))
            .andExpect(jsonPath("$.urlPhoto4").value(DEFAULT_URL_PHOTO_4))
            .andExpect(jsonPath("$.urlPhoto5").value(DEFAULT_URL_PHOTO_5))
            .andExpect(jsonPath("$.urlPhoto6").value(DEFAULT_URL_PHOTO_6))
            .andExpect(jsonPath("$.urlVideo").value(DEFAULT_URL_VIDEO));
    }

    @Test
    @Transactional
    void getNonExistingPropriete() throws Exception {
        // Get the propriete
        restProprieteMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewPropriete() throws Exception {
        // Initialize the database
        proprieteRepository.saveAndFlush(propriete);

        int databaseSizeBeforeUpdate = proprieteRepository.findAll().size();

        // Update the propriete
        Propriete updatedPropriete = proprieteRepository.findById(propriete.getId()).get();
        // Disconnect from session so that the updates on updatedPropriete are not directly saved in db
        em.detach(updatedPropriete);
        updatedPropriete
            .reference(UPDATED_REFERENCE)
            .type(UPDATED_TYPE)
            .modeDeTransaction(UPDATED_MODE_DE_TRANSACTION)
            .etat(UPDATED_ETAT)
            .description(UPDATED_DESCRIPTION)
            .prix(UPDATED_PRIX)
            .adresse(UPDATED_ADRESSE)
            .adresseTronque(UPDATED_ADRESSE_TRONQUE)
            .latitude(UPDATED_LATITUDE)
            .longitude(UPDATED_LONGITUDE)
            .superficie(UPDATED_SUPERFICIE)
            .anneeDeConstruction(UPDATED_ANNEE_DE_CONSTRUCTION)
            .nombreDePieces(UPDATED_NOMBRE_DE_PIECES)
            .nombreDeDouches(UPDATED_NOMBRE_DE_DOUCHES)
            .nombreDeGarages(UPDATED_NOMBRE_DE_GARAGES)
            .modeDePaiement(UPDATED_MODE_DE_PAIEMENT)
            .papier(UPDATED_PAPIER)
            .acceEelectricite(UPDATED_ACCE_EELECTRICITE)
            .accesEau(UPDATED_ACCES_EAU)
            .accesADSL(UPDATED_ACCES_ADSL)
            .meuble(UPDATED_MEUBLE)
            .enPromo(UPDATED_EN_PROMO)
            .periode(UPDATED_PERIODE)
            .distancePrimaire(UPDATED_DISTANCE_PRIMAIRE)
            .distanceSecondaire(UPDATED_DISTANCE_SECONDAIRE)
            .distanceLycee(UPDATED_DISTANCE_LYCEE)
            .distancehopital(UPDATED_DISTANCEHOPITAL)
            .distanceclinique(UPDATED_DISTANCECLINIQUE)
            .urlPhotoPrincipale(UPDATED_URL_PHOTO_PRINCIPALE)
            .urlPhoto1(UPDATED_URL_PHOTO_1)
            .urlPhoto2(UPDATED_URL_PHOTO_2)
            .urlPhoto3(UPDATED_URL_PHOTO_3)
            .urlPhoto4(UPDATED_URL_PHOTO_4)
            .urlPhoto5(UPDATED_URL_PHOTO_5)
            .urlPhoto6(UPDATED_URL_PHOTO_6)
            .urlVideo(UPDATED_URL_VIDEO);

        restProprieteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedPropriete.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedPropriete))
            )
            .andExpect(status().isOk());

        // Validate the Propriete in the database
        List<Propriete> proprieteList = proprieteRepository.findAll();
        assertThat(proprieteList).hasSize(databaseSizeBeforeUpdate);
        Propriete testPropriete = proprieteList.get(proprieteList.size() - 1);
        assertThat(testPropriete.getReference()).isEqualTo(UPDATED_REFERENCE);
        assertThat(testPropriete.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testPropriete.getModeDeTransaction()).isEqualTo(UPDATED_MODE_DE_TRANSACTION);
        assertThat(testPropriete.getEtat()).isEqualTo(UPDATED_ETAT);
        assertThat(testPropriete.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testPropriete.getPrix()).isEqualTo(UPDATED_PRIX);
        assertThat(testPropriete.getAdresse()).isEqualTo(UPDATED_ADRESSE);
        assertThat(testPropriete.getAdresseTronque()).isEqualTo(UPDATED_ADRESSE_TRONQUE);
        assertThat(testPropriete.getLatitude()).isEqualTo(UPDATED_LATITUDE);
        assertThat(testPropriete.getLongitude()).isEqualTo(UPDATED_LONGITUDE);
        assertThat(testPropriete.getSuperficie()).isEqualTo(UPDATED_SUPERFICIE);
        assertThat(testPropriete.getAnneeDeConstruction()).isEqualTo(UPDATED_ANNEE_DE_CONSTRUCTION);
        assertThat(testPropriete.getNombreDePieces()).isEqualTo(UPDATED_NOMBRE_DE_PIECES);
        assertThat(testPropriete.getNombreDeDouches()).isEqualTo(UPDATED_NOMBRE_DE_DOUCHES);
        assertThat(testPropriete.getNombreDeGarages()).isEqualTo(UPDATED_NOMBRE_DE_GARAGES);
        assertThat(testPropriete.getModeDePaiement()).isEqualTo(UPDATED_MODE_DE_PAIEMENT);
        assertThat(testPropriete.getPapier()).isEqualTo(UPDATED_PAPIER);
        assertThat(testPropriete.getAcceEelectricite()).isEqualTo(UPDATED_ACCE_EELECTRICITE);
        assertThat(testPropriete.getAccesEau()).isEqualTo(UPDATED_ACCES_EAU);
        assertThat(testPropriete.getAccesADSL()).isEqualTo(UPDATED_ACCES_ADSL);
        assertThat(testPropriete.getMeuble()).isEqualTo(UPDATED_MEUBLE);
        assertThat(testPropriete.getEnPromo()).isEqualTo(UPDATED_EN_PROMO);
        assertThat(testPropriete.getPeriode()).isEqualTo(UPDATED_PERIODE);
        assertThat(testPropriete.getDistancePrimaire()).isEqualTo(UPDATED_DISTANCE_PRIMAIRE);
        assertThat(testPropriete.getDistanceSecondaire()).isEqualTo(UPDATED_DISTANCE_SECONDAIRE);
        assertThat(testPropriete.getDistanceLycee()).isEqualTo(UPDATED_DISTANCE_LYCEE);
        assertThat(testPropriete.getDistancehopital()).isEqualTo(UPDATED_DISTANCEHOPITAL);
        assertThat(testPropriete.getDistanceclinique()).isEqualTo(UPDATED_DISTANCECLINIQUE);
        assertThat(testPropriete.getUrlPhotoPrincipale()).isEqualTo(UPDATED_URL_PHOTO_PRINCIPALE);
        assertThat(testPropriete.getUrlPhoto1()).isEqualTo(UPDATED_URL_PHOTO_1);
        assertThat(testPropriete.getUrlPhoto2()).isEqualTo(UPDATED_URL_PHOTO_2);
        assertThat(testPropriete.getUrlPhoto3()).isEqualTo(UPDATED_URL_PHOTO_3);
        assertThat(testPropriete.getUrlPhoto4()).isEqualTo(UPDATED_URL_PHOTO_4);
        assertThat(testPropriete.getUrlPhoto5()).isEqualTo(UPDATED_URL_PHOTO_5);
        assertThat(testPropriete.getUrlPhoto6()).isEqualTo(UPDATED_URL_PHOTO_6);
        assertThat(testPropriete.getUrlVideo()).isEqualTo(UPDATED_URL_VIDEO);
    }

    @Test
    @Transactional
    void putNonExistingPropriete() throws Exception {
        int databaseSizeBeforeUpdate = proprieteRepository.findAll().size();
        propriete.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProprieteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, propriete.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(propriete))
            )
            .andExpect(status().isBadRequest());

        // Validate the Propriete in the database
        List<Propriete> proprieteList = proprieteRepository.findAll();
        assertThat(proprieteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchPropriete() throws Exception {
        int databaseSizeBeforeUpdate = proprieteRepository.findAll().size();
        propriete.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProprieteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(propriete))
            )
            .andExpect(status().isBadRequest());

        // Validate the Propriete in the database
        List<Propriete> proprieteList = proprieteRepository.findAll();
        assertThat(proprieteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamPropriete() throws Exception {
        int databaseSizeBeforeUpdate = proprieteRepository.findAll().size();
        propriete.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProprieteMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(propriete)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Propriete in the database
        List<Propriete> proprieteList = proprieteRepository.findAll();
        assertThat(proprieteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateProprieteWithPatch() throws Exception {
        // Initialize the database
        proprieteRepository.saveAndFlush(propriete);

        int databaseSizeBeforeUpdate = proprieteRepository.findAll().size();

        // Update the propriete using partial update
        Propriete partialUpdatedPropriete = new Propriete();
        partialUpdatedPropriete.setId(propriete.getId());

        partialUpdatedPropriete
            .type(UPDATED_TYPE)
            .modeDeTransaction(UPDATED_MODE_DE_TRANSACTION)
            .prix(UPDATED_PRIX)
            .adresseTronque(UPDATED_ADRESSE_TRONQUE)
            .anneeDeConstruction(UPDATED_ANNEE_DE_CONSTRUCTION)
            .nombreDePieces(UPDATED_NOMBRE_DE_PIECES)
            .nombreDeGarages(UPDATED_NOMBRE_DE_GARAGES)
            .modeDePaiement(UPDATED_MODE_DE_PAIEMENT)
            .papier(UPDATED_PAPIER)
            .acceEelectricite(UPDATED_ACCE_EELECTRICITE)
            .enPromo(UPDATED_EN_PROMO)
            .periode(UPDATED_PERIODE)
            .distancePrimaire(UPDATED_DISTANCE_PRIMAIRE)
            .distanceSecondaire(UPDATED_DISTANCE_SECONDAIRE)
            .distanceLycee(UPDATED_DISTANCE_LYCEE)
            .distanceclinique(UPDATED_DISTANCECLINIQUE)
            .urlPhoto1(UPDATED_URL_PHOTO_1)
            .urlPhoto3(UPDATED_URL_PHOTO_3)
            .urlPhoto4(UPDATED_URL_PHOTO_4)
            .urlPhoto6(UPDATED_URL_PHOTO_6);

        restProprieteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPropriete.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPropriete))
            )
            .andExpect(status().isOk());

        // Validate the Propriete in the database
        List<Propriete> proprieteList = proprieteRepository.findAll();
        assertThat(proprieteList).hasSize(databaseSizeBeforeUpdate);
        Propriete testPropriete = proprieteList.get(proprieteList.size() - 1);
        assertThat(testPropriete.getReference()).isEqualTo(DEFAULT_REFERENCE);
        assertThat(testPropriete.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testPropriete.getModeDeTransaction()).isEqualTo(UPDATED_MODE_DE_TRANSACTION);
        assertThat(testPropriete.getEtat()).isEqualTo(DEFAULT_ETAT);
        assertThat(testPropriete.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testPropriete.getPrix()).isEqualTo(UPDATED_PRIX);
        assertThat(testPropriete.getAdresse()).isEqualTo(DEFAULT_ADRESSE);
        assertThat(testPropriete.getAdresseTronque()).isEqualTo(UPDATED_ADRESSE_TRONQUE);
        assertThat(testPropriete.getLatitude()).isEqualTo(DEFAULT_LATITUDE);
        assertThat(testPropriete.getLongitude()).isEqualTo(DEFAULT_LONGITUDE);
        assertThat(testPropriete.getSuperficie()).isEqualTo(DEFAULT_SUPERFICIE);
        assertThat(testPropriete.getAnneeDeConstruction()).isEqualTo(UPDATED_ANNEE_DE_CONSTRUCTION);
        assertThat(testPropriete.getNombreDePieces()).isEqualTo(UPDATED_NOMBRE_DE_PIECES);
        assertThat(testPropriete.getNombreDeDouches()).isEqualTo(DEFAULT_NOMBRE_DE_DOUCHES);
        assertThat(testPropriete.getNombreDeGarages()).isEqualTo(UPDATED_NOMBRE_DE_GARAGES);
        assertThat(testPropriete.getModeDePaiement()).isEqualTo(UPDATED_MODE_DE_PAIEMENT);
        assertThat(testPropriete.getPapier()).isEqualTo(UPDATED_PAPIER);
        assertThat(testPropriete.getAcceEelectricite()).isEqualTo(UPDATED_ACCE_EELECTRICITE);
        assertThat(testPropriete.getAccesEau()).isEqualTo(DEFAULT_ACCES_EAU);
        assertThat(testPropriete.getAccesADSL()).isEqualTo(DEFAULT_ACCES_ADSL);
        assertThat(testPropriete.getMeuble()).isEqualTo(DEFAULT_MEUBLE);
        assertThat(testPropriete.getEnPromo()).isEqualTo(UPDATED_EN_PROMO);
        assertThat(testPropriete.getPeriode()).isEqualTo(UPDATED_PERIODE);
        assertThat(testPropriete.getDistancePrimaire()).isEqualTo(UPDATED_DISTANCE_PRIMAIRE);
        assertThat(testPropriete.getDistanceSecondaire()).isEqualTo(UPDATED_DISTANCE_SECONDAIRE);
        assertThat(testPropriete.getDistanceLycee()).isEqualTo(UPDATED_DISTANCE_LYCEE);
        assertThat(testPropriete.getDistancehopital()).isEqualTo(DEFAULT_DISTANCEHOPITAL);
        assertThat(testPropriete.getDistanceclinique()).isEqualTo(UPDATED_DISTANCECLINIQUE);
        assertThat(testPropriete.getUrlPhotoPrincipale()).isEqualTo(DEFAULT_URL_PHOTO_PRINCIPALE);
        assertThat(testPropriete.getUrlPhoto1()).isEqualTo(UPDATED_URL_PHOTO_1);
        assertThat(testPropriete.getUrlPhoto2()).isEqualTo(DEFAULT_URL_PHOTO_2);
        assertThat(testPropriete.getUrlPhoto3()).isEqualTo(UPDATED_URL_PHOTO_3);
        assertThat(testPropriete.getUrlPhoto4()).isEqualTo(UPDATED_URL_PHOTO_4);
        assertThat(testPropriete.getUrlPhoto5()).isEqualTo(DEFAULT_URL_PHOTO_5);
        assertThat(testPropriete.getUrlPhoto6()).isEqualTo(UPDATED_URL_PHOTO_6);
        assertThat(testPropriete.getUrlVideo()).isEqualTo(DEFAULT_URL_VIDEO);
    }

    @Test
    @Transactional
    void fullUpdateProprieteWithPatch() throws Exception {
        // Initialize the database
        proprieteRepository.saveAndFlush(propriete);

        int databaseSizeBeforeUpdate = proprieteRepository.findAll().size();

        // Update the propriete using partial update
        Propriete partialUpdatedPropriete = new Propriete();
        partialUpdatedPropriete.setId(propriete.getId());

        partialUpdatedPropriete
            .reference(UPDATED_REFERENCE)
            .type(UPDATED_TYPE)
            .modeDeTransaction(UPDATED_MODE_DE_TRANSACTION)
            .etat(UPDATED_ETAT)
            .description(UPDATED_DESCRIPTION)
            .prix(UPDATED_PRIX)
            .adresse(UPDATED_ADRESSE)
            .adresseTronque(UPDATED_ADRESSE_TRONQUE)
            .latitude(UPDATED_LATITUDE)
            .longitude(UPDATED_LONGITUDE)
            .superficie(UPDATED_SUPERFICIE)
            .anneeDeConstruction(UPDATED_ANNEE_DE_CONSTRUCTION)
            .nombreDePieces(UPDATED_NOMBRE_DE_PIECES)
            .nombreDeDouches(UPDATED_NOMBRE_DE_DOUCHES)
            .nombreDeGarages(UPDATED_NOMBRE_DE_GARAGES)
            .modeDePaiement(UPDATED_MODE_DE_PAIEMENT)
            .papier(UPDATED_PAPIER)
            .acceEelectricite(UPDATED_ACCE_EELECTRICITE)
            .accesEau(UPDATED_ACCES_EAU)
            .accesADSL(UPDATED_ACCES_ADSL)
            .meuble(UPDATED_MEUBLE)
            .enPromo(UPDATED_EN_PROMO)
            .periode(UPDATED_PERIODE)
            .distancePrimaire(UPDATED_DISTANCE_PRIMAIRE)
            .distanceSecondaire(UPDATED_DISTANCE_SECONDAIRE)
            .distanceLycee(UPDATED_DISTANCE_LYCEE)
            .distancehopital(UPDATED_DISTANCEHOPITAL)
            .distanceclinique(UPDATED_DISTANCECLINIQUE)
            .urlPhotoPrincipale(UPDATED_URL_PHOTO_PRINCIPALE)
            .urlPhoto1(UPDATED_URL_PHOTO_1)
            .urlPhoto2(UPDATED_URL_PHOTO_2)
            .urlPhoto3(UPDATED_URL_PHOTO_3)
            .urlPhoto4(UPDATED_URL_PHOTO_4)
            .urlPhoto5(UPDATED_URL_PHOTO_5)
            .urlPhoto6(UPDATED_URL_PHOTO_6)
            .urlVideo(UPDATED_URL_VIDEO);

        restProprieteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPropriete.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPropriete))
            )
            .andExpect(status().isOk());

        // Validate the Propriete in the database
        List<Propriete> proprieteList = proprieteRepository.findAll();
        assertThat(proprieteList).hasSize(databaseSizeBeforeUpdate);
        Propriete testPropriete = proprieteList.get(proprieteList.size() - 1);
        assertThat(testPropriete.getReference()).isEqualTo(UPDATED_REFERENCE);
        assertThat(testPropriete.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testPropriete.getModeDeTransaction()).isEqualTo(UPDATED_MODE_DE_TRANSACTION);
        assertThat(testPropriete.getEtat()).isEqualTo(UPDATED_ETAT);
        assertThat(testPropriete.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testPropriete.getPrix()).isEqualTo(UPDATED_PRIX);
        assertThat(testPropriete.getAdresse()).isEqualTo(UPDATED_ADRESSE);
        assertThat(testPropriete.getAdresseTronque()).isEqualTo(UPDATED_ADRESSE_TRONQUE);
        assertThat(testPropriete.getLatitude()).isEqualTo(UPDATED_LATITUDE);
        assertThat(testPropriete.getLongitude()).isEqualTo(UPDATED_LONGITUDE);
        assertThat(testPropriete.getSuperficie()).isEqualTo(UPDATED_SUPERFICIE);
        assertThat(testPropriete.getAnneeDeConstruction()).isEqualTo(UPDATED_ANNEE_DE_CONSTRUCTION);
        assertThat(testPropriete.getNombreDePieces()).isEqualTo(UPDATED_NOMBRE_DE_PIECES);
        assertThat(testPropriete.getNombreDeDouches()).isEqualTo(UPDATED_NOMBRE_DE_DOUCHES);
        assertThat(testPropriete.getNombreDeGarages()).isEqualTo(UPDATED_NOMBRE_DE_GARAGES);
        assertThat(testPropriete.getModeDePaiement()).isEqualTo(UPDATED_MODE_DE_PAIEMENT);
        assertThat(testPropriete.getPapier()).isEqualTo(UPDATED_PAPIER);
        assertThat(testPropriete.getAcceEelectricite()).isEqualTo(UPDATED_ACCE_EELECTRICITE);
        assertThat(testPropriete.getAccesEau()).isEqualTo(UPDATED_ACCES_EAU);
        assertThat(testPropriete.getAccesADSL()).isEqualTo(UPDATED_ACCES_ADSL);
        assertThat(testPropriete.getMeuble()).isEqualTo(UPDATED_MEUBLE);
        assertThat(testPropriete.getEnPromo()).isEqualTo(UPDATED_EN_PROMO);
        assertThat(testPropriete.getPeriode()).isEqualTo(UPDATED_PERIODE);
        assertThat(testPropriete.getDistancePrimaire()).isEqualTo(UPDATED_DISTANCE_PRIMAIRE);
        assertThat(testPropriete.getDistanceSecondaire()).isEqualTo(UPDATED_DISTANCE_SECONDAIRE);
        assertThat(testPropriete.getDistanceLycee()).isEqualTo(UPDATED_DISTANCE_LYCEE);
        assertThat(testPropriete.getDistancehopital()).isEqualTo(UPDATED_DISTANCEHOPITAL);
        assertThat(testPropriete.getDistanceclinique()).isEqualTo(UPDATED_DISTANCECLINIQUE);
        assertThat(testPropriete.getUrlPhotoPrincipale()).isEqualTo(UPDATED_URL_PHOTO_PRINCIPALE);
        assertThat(testPropriete.getUrlPhoto1()).isEqualTo(UPDATED_URL_PHOTO_1);
        assertThat(testPropriete.getUrlPhoto2()).isEqualTo(UPDATED_URL_PHOTO_2);
        assertThat(testPropriete.getUrlPhoto3()).isEqualTo(UPDATED_URL_PHOTO_3);
        assertThat(testPropriete.getUrlPhoto4()).isEqualTo(UPDATED_URL_PHOTO_4);
        assertThat(testPropriete.getUrlPhoto5()).isEqualTo(UPDATED_URL_PHOTO_5);
        assertThat(testPropriete.getUrlPhoto6()).isEqualTo(UPDATED_URL_PHOTO_6);
        assertThat(testPropriete.getUrlVideo()).isEqualTo(UPDATED_URL_VIDEO);
    }

    @Test
    @Transactional
    void patchNonExistingPropriete() throws Exception {
        int databaseSizeBeforeUpdate = proprieteRepository.findAll().size();
        propriete.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProprieteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, propriete.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(propriete))
            )
            .andExpect(status().isBadRequest());

        // Validate the Propriete in the database
        List<Propriete> proprieteList = proprieteRepository.findAll();
        assertThat(proprieteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchPropriete() throws Exception {
        int databaseSizeBeforeUpdate = proprieteRepository.findAll().size();
        propriete.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProprieteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(propriete))
            )
            .andExpect(status().isBadRequest());

        // Validate the Propriete in the database
        List<Propriete> proprieteList = proprieteRepository.findAll();
        assertThat(proprieteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamPropriete() throws Exception {
        int databaseSizeBeforeUpdate = proprieteRepository.findAll().size();
        propriete.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProprieteMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(propriete))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Propriete in the database
        List<Propriete> proprieteList = proprieteRepository.findAll();
        assertThat(proprieteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deletePropriete() throws Exception {
        // Initialize the database
        proprieteRepository.saveAndFlush(propriete);

        int databaseSizeBeforeDelete = proprieteRepository.findAll().size();

        // Delete the propriete
        restProprieteMockMvc
            .perform(delete(ENTITY_API_URL_ID, propriete.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Propriete> proprieteList = proprieteRepository.findAll();
        assertThat(proprieteList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
