package com.techxel.buntu.web.rest;

import com.techxel.buntu.domain.Propriete;
import com.techxel.buntu.repository.ProprieteRepository;
import com.techxel.buntu.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.techxel.buntu.domain.Propriete}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ProprieteResource {

    private final Logger log = LoggerFactory.getLogger(ProprieteResource.class);

    private static final String ENTITY_NAME = "propriete";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ProprieteRepository proprieteRepository;

    public ProprieteResource(ProprieteRepository proprieteRepository) {
        this.proprieteRepository = proprieteRepository;
    }

    /**
     * {@code POST  /proprietes} : Create a new propriete.
     *
     * @param propriete the propriete to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new propriete, or with status {@code 400 (Bad Request)} if the propriete has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/proprietes")
    public ResponseEntity<Propriete> createPropriete(@Valid @RequestBody Propriete propriete) throws URISyntaxException {
        log.debug("REST request to save Propriete : {}", propriete);
        if (propriete.getId() != null) {
            throw new BadRequestAlertException("A new propriete cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Propriete result = proprieteRepository.save(propriete);
        return ResponseEntity
            .created(new URI("/api/proprietes/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /proprietes/:id} : Updates an existing propriete.
     *
     * @param id the id of the propriete to save.
     * @param propriete the propriete to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated propriete,
     * or with status {@code 400 (Bad Request)} if the propriete is not valid,
     * or with status {@code 500 (Internal Server Error)} if the propriete couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/proprietes/{id}")
    public ResponseEntity<Propriete> updatePropriete(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Propriete propriete
    ) throws URISyntaxException {
        log.debug("REST request to update Propriete : {}, {}", id, propriete);
        if (propriete.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, propriete.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!proprieteRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Propriete result = proprieteRepository.save(propriete);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, propriete.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /proprietes/:id} : Partial updates given fields of an existing propriete, field will ignore if it is null
     *
     * @param id the id of the propriete to save.
     * @param propriete the propriete to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated propriete,
     * or with status {@code 400 (Bad Request)} if the propriete is not valid,
     * or with status {@code 404 (Not Found)} if the propriete is not found,
     * or with status {@code 500 (Internal Server Error)} if the propriete couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/proprietes/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Propriete> partialUpdatePropriete(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Propriete propriete
    ) throws URISyntaxException {
        log.debug("REST request to partial update Propriete partially : {}, {}", id, propriete);
        if (propriete.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, propriete.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!proprieteRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Propriete> result = proprieteRepository
            .findById(propriete.getId())
            .map(existingPropriete -> {
                if (propriete.getReference() != null) {
                    existingPropriete.setReference(propriete.getReference());
                }
                if (propriete.getType() != null) {
                    existingPropriete.setType(propriete.getType());
                }
                if (propriete.getModeDeTransaction() != null) {
                    existingPropriete.setModeDeTransaction(propriete.getModeDeTransaction());
                }
                if (propriete.getEtat() != null) {
                    existingPropriete.setEtat(propriete.getEtat());
                }
                if (propriete.getDescription() != null) {
                    existingPropriete.setDescription(propriete.getDescription());
                }
                if (propriete.getPrix() != null) {
                    existingPropriete.setPrix(propriete.getPrix());
                }
                if (propriete.getAdresse() != null) {
                    existingPropriete.setAdresse(propriete.getAdresse());
                }
                if (propriete.getAdresseTronque() != null) {
                    existingPropriete.setAdresseTronque(propriete.getAdresseTronque());
                }
                if (propriete.getLatitude() != null) {
                    existingPropriete.setLatitude(propriete.getLatitude());
                }
                if (propriete.getLongitude() != null) {
                    existingPropriete.setLongitude(propriete.getLongitude());
                }
                if (propriete.getSuperficie() != null) {
                    existingPropriete.setSuperficie(propriete.getSuperficie());
                }
                if (propriete.getAnneeDeConstruction() != null) {
                    existingPropriete.setAnneeDeConstruction(propriete.getAnneeDeConstruction());
                }
                if (propriete.getNombreDePieces() != null) {
                    existingPropriete.setNombreDePieces(propriete.getNombreDePieces());
                }
                if (propriete.getNombreDeDouches() != null) {
                    existingPropriete.setNombreDeDouches(propriete.getNombreDeDouches());
                }
                if (propriete.getNombreDeGarages() != null) {
                    existingPropriete.setNombreDeGarages(propriete.getNombreDeGarages());
                }
                if (propriete.getModeDePaiement() != null) {
                    existingPropriete.setModeDePaiement(propriete.getModeDePaiement());
                }
                if (propriete.getPapier() != null) {
                    existingPropriete.setPapier(propriete.getPapier());
                }
                if (propriete.getAcceEelectricite() != null) {
                    existingPropriete.setAcceEelectricite(propriete.getAcceEelectricite());
                }
                if (propriete.getAccesEau() != null) {
                    existingPropriete.setAccesEau(propriete.getAccesEau());
                }
                if (propriete.getAccesADSL() != null) {
                    existingPropriete.setAccesADSL(propriete.getAccesADSL());
                }
                if (propriete.getMeuble() != null) {
                    existingPropriete.setMeuble(propriete.getMeuble());
                }
                if (propriete.getEnPromo() != null) {
                    existingPropriete.setEnPromo(propriete.getEnPromo());
                }
                if (propriete.getPeriode() != null) {
                    existingPropriete.setPeriode(propriete.getPeriode());
                }
                if (propriete.getDistancePrimaire() != null) {
                    existingPropriete.setDistancePrimaire(propriete.getDistancePrimaire());
                }
                if (propriete.getDistanceSecondaire() != null) {
                    existingPropriete.setDistanceSecondaire(propriete.getDistanceSecondaire());
                }
                if (propriete.getDistanceLycee() != null) {
                    existingPropriete.setDistanceLycee(propriete.getDistanceLycee());
                }
                if (propriete.getDistancehopital() != null) {
                    existingPropriete.setDistancehopital(propriete.getDistancehopital());
                }
                if (propriete.getDistanceclinique() != null) {
                    existingPropriete.setDistanceclinique(propriete.getDistanceclinique());
                }
                if (propriete.getUrlPhotoPrincipale() != null) {
                    existingPropriete.setUrlPhotoPrincipale(propriete.getUrlPhotoPrincipale());
                }
                if (propriete.getUrlPhoto1() != null) {
                    existingPropriete.setUrlPhoto1(propriete.getUrlPhoto1());
                }
                if (propriete.getUrlPhoto2() != null) {
                    existingPropriete.setUrlPhoto2(propriete.getUrlPhoto2());
                }
                if (propriete.getUrlPhoto3() != null) {
                    existingPropriete.setUrlPhoto3(propriete.getUrlPhoto3());
                }
                if (propriete.getUrlPhoto4() != null) {
                    existingPropriete.setUrlPhoto4(propriete.getUrlPhoto4());
                }
                if (propriete.getUrlPhoto5() != null) {
                    existingPropriete.setUrlPhoto5(propriete.getUrlPhoto5());
                }
                if (propriete.getUrlPhoto6() != null) {
                    existingPropriete.setUrlPhoto6(propriete.getUrlPhoto6());
                }
                if (propriete.getUrlVideo() != null) {
                    existingPropriete.setUrlVideo(propriete.getUrlVideo());
                }

                return existingPropriete;
            })
            .map(proprieteRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, propriete.getId().toString())
        );
    }

    /**
     * {@code GET  /proprietes} : get all the proprietes.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of proprietes in body.
     */
    @GetMapping("/proprietes")
    public List<Propriete> getAllProprietes() {
        log.debug("REST request to get all Proprietes");
        return proprieteRepository.findAll();
    }

    /**
     * {@code GET  /proprietes/:id} : get the "id" propriete.
     *
     * @param id the id of the propriete to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the propriete, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/proprietes/{id}")
    public ResponseEntity<Propriete> getPropriete(@PathVariable Long id) {
        log.debug("REST request to get Propriete : {}", id);
        Optional<Propriete> propriete = proprieteRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(propriete);
    }

    /**
     * {@code DELETE  /proprietes/:id} : delete the "id" propriete.
     *
     * @param id the id of the propriete to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/proprietes/{id}")
    public ResponseEntity<Void> deletePropriete(@PathVariable Long id) {
        log.debug("REST request to delete Propriete : {}", id);
        proprieteRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
