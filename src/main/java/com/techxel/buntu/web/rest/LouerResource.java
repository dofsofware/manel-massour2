package com.techxel.buntu.web.rest;

import com.techxel.buntu.domain.Louer;
import com.techxel.buntu.repository.LouerRepository;
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
 * REST controller for managing {@link com.techxel.buntu.domain.Louer}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class LouerResource {

    private final Logger log = LoggerFactory.getLogger(LouerResource.class);

    private static final String ENTITY_NAME = "louer";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final LouerRepository louerRepository;

    public LouerResource(LouerRepository louerRepository) {
        this.louerRepository = louerRepository;
    }

    /**
     * {@code POST  /louers} : Create a new louer.
     *
     * @param louer the louer to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new louer, or with status {@code 400 (Bad Request)} if the louer has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/louers")
    public ResponseEntity<Louer> createLouer(@RequestBody Louer louer) throws URISyntaxException {
        log.debug("REST request to save Louer : {}", louer);
        if (louer.getId() != null) {
            throw new BadRequestAlertException("A new louer cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Louer result = louerRepository.save(louer);
        return ResponseEntity
            .created(new URI("/api/louers/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /louers/:id} : Updates an existing louer.
     *
     * @param id the id of the louer to save.
     * @param louer the louer to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated louer,
     * or with status {@code 400 (Bad Request)} if the louer is not valid,
     * or with status {@code 500 (Internal Server Error)} if the louer couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/louers/{id}")
    public ResponseEntity<Louer> updateLouer(@PathVariable(value = "id", required = false) final Long id, @RequestBody Louer louer)
        throws URISyntaxException {
        log.debug("REST request to update Louer : {}, {}", id, louer);
        if (louer.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, louer.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!louerRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        // no save call needed as we have no fields that can be updated
        Louer result = louer;
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, louer.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /louers/:id} : Partial updates given fields of an existing louer, field will ignore if it is null
     *
     * @param id the id of the louer to save.
     * @param louer the louer to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated louer,
     * or with status {@code 400 (Bad Request)} if the louer is not valid,
     * or with status {@code 404 (Not Found)} if the louer is not found,
     * or with status {@code 500 (Internal Server Error)} if the louer couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/louers/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Louer> partialUpdateLouer(@PathVariable(value = "id", required = false) final Long id, @RequestBody Louer louer)
        throws URISyntaxException {
        log.debug("REST request to partial update Louer partially : {}, {}", id, louer);
        if (louer.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, louer.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!louerRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Louer> result = louerRepository
            .findById(louer.getId())
            .map(existingLouer -> {
                return existingLouer;
            }); // .map(louerRepository::save)

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, louer.getId().toString())
        );
    }

    /**
     * {@code GET  /louers} : get all the louers.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of louers in body.
     */
    @GetMapping("/louers")
    public List<Louer> getAllLouers() {
        log.debug("REST request to get all Louers");
        return louerRepository.findAll();
    }

    /**
     * {@code GET  /louers/:id} : get the "id" louer.
     *
     * @param id the id of the louer to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the louer, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/louers/{id}")
    public ResponseEntity<Louer> getLouer(@PathVariable Long id) {
        log.debug("REST request to get Louer : {}", id);
        Optional<Louer> louer = louerRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(louer);
    }

    /**
     * {@code DELETE  /louers/:id} : delete the "id" louer.
     *
     * @param id the id of the louer to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/louers/{id}")
    public ResponseEntity<Void> deleteLouer(@PathVariable Long id) {
        log.debug("REST request to delete Louer : {}", id);
        louerRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
