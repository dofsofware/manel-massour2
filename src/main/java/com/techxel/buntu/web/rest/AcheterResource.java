package com.techxel.buntu.web.rest;

import com.techxel.buntu.domain.Acheter;
import com.techxel.buntu.repository.AcheterRepository;
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
 * REST controller for managing {@link com.techxel.buntu.domain.Acheter}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class AcheterResource {

    private final Logger log = LoggerFactory.getLogger(AcheterResource.class);

    private static final String ENTITY_NAME = "acheter";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AcheterRepository acheterRepository;

    public AcheterResource(AcheterRepository acheterRepository) {
        this.acheterRepository = acheterRepository;
    }

    /**
     * {@code POST  /acheters} : Create a new acheter.
     *
     * @param acheter the acheter to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new acheter, or with status {@code 400 (Bad Request)} if the acheter has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/acheters")
    public ResponseEntity<Acheter> createAcheter(@RequestBody Acheter acheter) throws URISyntaxException {
        log.debug("REST request to save Acheter : {}", acheter);
        if (acheter.getId() != null) {
            throw new BadRequestAlertException("A new acheter cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Acheter result = acheterRepository.save(acheter);
        return ResponseEntity
            .created(new URI("/api/acheters/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /acheters/:id} : Updates an existing acheter.
     *
     * @param id the id of the acheter to save.
     * @param acheter the acheter to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated acheter,
     * or with status {@code 400 (Bad Request)} if the acheter is not valid,
     * or with status {@code 500 (Internal Server Error)} if the acheter couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/acheters/{id}")
    public ResponseEntity<Acheter> updateAcheter(@PathVariable(value = "id", required = false) final Long id, @RequestBody Acheter acheter)
        throws URISyntaxException {
        log.debug("REST request to update Acheter : {}, {}", id, acheter);
        if (acheter.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, acheter.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!acheterRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        // no save call needed as we have no fields that can be updated
        Acheter result = acheter;
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, acheter.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /acheters/:id} : Partial updates given fields of an existing acheter, field will ignore if it is null
     *
     * @param id the id of the acheter to save.
     * @param acheter the acheter to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated acheter,
     * or with status {@code 400 (Bad Request)} if the acheter is not valid,
     * or with status {@code 404 (Not Found)} if the acheter is not found,
     * or with status {@code 500 (Internal Server Error)} if the acheter couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/acheters/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Acheter> partialUpdateAcheter(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Acheter acheter
    ) throws URISyntaxException {
        log.debug("REST request to partial update Acheter partially : {}, {}", id, acheter);
        if (acheter.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, acheter.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!acheterRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Acheter> result = acheterRepository
            .findById(acheter.getId())
            .map(existingAcheter -> {
                return existingAcheter;
            }); // .map(acheterRepository::save)

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, acheter.getId().toString())
        );
    }

    /**
     * {@code GET  /acheters} : get all the acheters.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of acheters in body.
     */
    @GetMapping("/acheters")
    public List<Acheter> getAllAcheters() {
        log.debug("REST request to get all Acheters");
        return acheterRepository.findAll();
    }

    /**
     * {@code GET  /acheters/:id} : get the "id" acheter.
     *
     * @param id the id of the acheter to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the acheter, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/acheters/{id}")
    public ResponseEntity<Acheter> getAcheter(@PathVariable Long id) {
        log.debug("REST request to get Acheter : {}", id);
        Optional<Acheter> acheter = acheterRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(acheter);
    }

    /**
     * {@code DELETE  /acheters/:id} : delete the "id" acheter.
     *
     * @param id the id of the acheter to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/acheters/{id}")
    public ResponseEntity<Void> deleteAcheter(@PathVariable Long id) {
        log.debug("REST request to delete Acheter : {}", id);
        acheterRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
