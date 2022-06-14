package com.techxel.buntu.web.rest;

import com.techxel.buntu.domain.Estimer;
import com.techxel.buntu.repository.EstimerRepository;
import com.techxel.buntu.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.techxel.buntu.domain.Estimer}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class EstimerResource {

    private final Logger log = LoggerFactory.getLogger(EstimerResource.class);

    private static final String ENTITY_NAME = "estimer";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final EstimerRepository estimerRepository;

    public EstimerResource(EstimerRepository estimerRepository) {
        this.estimerRepository = estimerRepository;
    }

    /**
     * {@code POST  /estimers} : Create a new estimer.
     *
     * @param estimer the estimer to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new estimer, or with status {@code 400 (Bad Request)} if the estimer has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/estimers")
    public ResponseEntity<Estimer> createEstimer(@RequestBody Estimer estimer) throws URISyntaxException {
        log.debug("REST request to save Estimer : {}", estimer);
        if (estimer.getId() != null) {
            throw new BadRequestAlertException("A new estimer cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Estimer result = estimerRepository.save(estimer);
        return ResponseEntity
            .created(new URI("/api/estimers/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /estimers/:id} : Updates an existing estimer.
     *
     * @param id the id of the estimer to save.
     * @param estimer the estimer to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated estimer,
     * or with status {@code 400 (Bad Request)} if the estimer is not valid,
     * or with status {@code 500 (Internal Server Error)} if the estimer couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/estimers/{id}")
    public ResponseEntity<Estimer> updateEstimer(@PathVariable(value = "id", required = false) final Long id, @RequestBody Estimer estimer)
        throws URISyntaxException {
        log.debug("REST request to update Estimer : {}, {}", id, estimer);
        if (estimer.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, estimer.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!estimerRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        // no save call needed as we have no fields that can be updated
        Estimer result = estimer;
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, estimer.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /estimers/:id} : Partial updates given fields of an existing estimer, field will ignore if it is null
     *
     * @param id the id of the estimer to save.
     * @param estimer the estimer to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated estimer,
     * or with status {@code 400 (Bad Request)} if the estimer is not valid,
     * or with status {@code 404 (Not Found)} if the estimer is not found,
     * or with status {@code 500 (Internal Server Error)} if the estimer couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/estimers/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Estimer> partialUpdateEstimer(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Estimer estimer
    ) throws URISyntaxException {
        log.debug("REST request to partial update Estimer partially : {}, {}", id, estimer);
        if (estimer.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, estimer.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!estimerRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Estimer> result = estimerRepository
            .findById(estimer.getId())
            .map(existingEstimer -> {
                return existingEstimer;
            }); // .map(estimerRepository::save)

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, estimer.getId().toString())
        );
    }

    /**
     * {@code GET  /estimers} : get all the estimers.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of estimers in body.
     */
    @GetMapping("/estimers")
    public List<Estimer> getAllEstimers() {
        log.debug("REST request to get all Estimers");
        return estimerRepository.findAll();
    }

    /**
     * {@code GET  /estimers/:id} : get the "id" estimer.
     *
     * @param id the id of the estimer to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the estimer, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/estimers/{id}")
    public ResponseEntity<Estimer> getEstimer(@PathVariable Long id) {
        log.debug("REST request to get Estimer : {}", id);
        Optional<Estimer> estimer = estimerRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(estimer);
    }

    /**
     * {@code DELETE  /estimers/:id} : delete the "id" estimer.
     *
     * @param id the id of the estimer to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/estimers/{id}")
    public ResponseEntity<Void> deleteEstimer(@PathVariable Long id) {
        log.debug("REST request to delete Estimer : {}", id);
        estimerRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
