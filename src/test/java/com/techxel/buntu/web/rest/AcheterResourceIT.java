package com.techxel.buntu.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.techxel.buntu.IntegrationTest;
import com.techxel.buntu.domain.Acheter;
import com.techxel.buntu.repository.AcheterRepository;
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

/**
 * Integration tests for the {@link AcheterResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class AcheterResourceIT {

    private static final String ENTITY_API_URL = "/api/acheters";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private AcheterRepository acheterRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAcheterMockMvc;

    private Acheter acheter;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Acheter createEntity(EntityManager em) {
        Acheter acheter = new Acheter();
        return acheter;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Acheter createUpdatedEntity(EntityManager em) {
        Acheter acheter = new Acheter();
        return acheter;
    }

    @BeforeEach
    public void initTest() {
        acheter = createEntity(em);
    }

    @Test
    @Transactional
    void createAcheter() throws Exception {
        int databaseSizeBeforeCreate = acheterRepository.findAll().size();
        // Create the Acheter
        restAcheterMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(acheter)))
            .andExpect(status().isCreated());

        // Validate the Acheter in the database
        List<Acheter> acheterList = acheterRepository.findAll();
        assertThat(acheterList).hasSize(databaseSizeBeforeCreate + 1);
        Acheter testAcheter = acheterList.get(acheterList.size() - 1);
    }

    @Test
    @Transactional
    void createAcheterWithExistingId() throws Exception {
        // Create the Acheter with an existing ID
        acheter.setId(1L);

        int databaseSizeBeforeCreate = acheterRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAcheterMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(acheter)))
            .andExpect(status().isBadRequest());

        // Validate the Acheter in the database
        List<Acheter> acheterList = acheterRepository.findAll();
        assertThat(acheterList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllAcheters() throws Exception {
        // Initialize the database
        acheterRepository.saveAndFlush(acheter);

        // Get all the acheterList
        restAcheterMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(acheter.getId().intValue())));
    }

    @Test
    @Transactional
    void getAcheter() throws Exception {
        // Initialize the database
        acheterRepository.saveAndFlush(acheter);

        // Get the acheter
        restAcheterMockMvc
            .perform(get(ENTITY_API_URL_ID, acheter.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(acheter.getId().intValue()));
    }

    @Test
    @Transactional
    void getNonExistingAcheter() throws Exception {
        // Get the acheter
        restAcheterMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewAcheter() throws Exception {
        // Initialize the database
        acheterRepository.saveAndFlush(acheter);

        int databaseSizeBeforeUpdate = acheterRepository.findAll().size();

        // Update the acheter
        Acheter updatedAcheter = acheterRepository.findById(acheter.getId()).get();
        // Disconnect from session so that the updates on updatedAcheter are not directly saved in db
        em.detach(updatedAcheter);

        restAcheterMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAcheter.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAcheter))
            )
            .andExpect(status().isOk());

        // Validate the Acheter in the database
        List<Acheter> acheterList = acheterRepository.findAll();
        assertThat(acheterList).hasSize(databaseSizeBeforeUpdate);
        Acheter testAcheter = acheterList.get(acheterList.size() - 1);
    }

    @Test
    @Transactional
    void putNonExistingAcheter() throws Exception {
        int databaseSizeBeforeUpdate = acheterRepository.findAll().size();
        acheter.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAcheterMockMvc
            .perform(
                put(ENTITY_API_URL_ID, acheter.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(acheter))
            )
            .andExpect(status().isBadRequest());

        // Validate the Acheter in the database
        List<Acheter> acheterList = acheterRepository.findAll();
        assertThat(acheterList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAcheter() throws Exception {
        int databaseSizeBeforeUpdate = acheterRepository.findAll().size();
        acheter.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAcheterMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(acheter))
            )
            .andExpect(status().isBadRequest());

        // Validate the Acheter in the database
        List<Acheter> acheterList = acheterRepository.findAll();
        assertThat(acheterList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAcheter() throws Exception {
        int databaseSizeBeforeUpdate = acheterRepository.findAll().size();
        acheter.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAcheterMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(acheter)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Acheter in the database
        List<Acheter> acheterList = acheterRepository.findAll();
        assertThat(acheterList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAcheterWithPatch() throws Exception {
        // Initialize the database
        acheterRepository.saveAndFlush(acheter);

        int databaseSizeBeforeUpdate = acheterRepository.findAll().size();

        // Update the acheter using partial update
        Acheter partialUpdatedAcheter = new Acheter();
        partialUpdatedAcheter.setId(acheter.getId());

        restAcheterMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAcheter.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAcheter))
            )
            .andExpect(status().isOk());

        // Validate the Acheter in the database
        List<Acheter> acheterList = acheterRepository.findAll();
        assertThat(acheterList).hasSize(databaseSizeBeforeUpdate);
        Acheter testAcheter = acheterList.get(acheterList.size() - 1);
    }

    @Test
    @Transactional
    void fullUpdateAcheterWithPatch() throws Exception {
        // Initialize the database
        acheterRepository.saveAndFlush(acheter);

        int databaseSizeBeforeUpdate = acheterRepository.findAll().size();

        // Update the acheter using partial update
        Acheter partialUpdatedAcheter = new Acheter();
        partialUpdatedAcheter.setId(acheter.getId());

        restAcheterMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAcheter.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAcheter))
            )
            .andExpect(status().isOk());

        // Validate the Acheter in the database
        List<Acheter> acheterList = acheterRepository.findAll();
        assertThat(acheterList).hasSize(databaseSizeBeforeUpdate);
        Acheter testAcheter = acheterList.get(acheterList.size() - 1);
    }

    @Test
    @Transactional
    void patchNonExistingAcheter() throws Exception {
        int databaseSizeBeforeUpdate = acheterRepository.findAll().size();
        acheter.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAcheterMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, acheter.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(acheter))
            )
            .andExpect(status().isBadRequest());

        // Validate the Acheter in the database
        List<Acheter> acheterList = acheterRepository.findAll();
        assertThat(acheterList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAcheter() throws Exception {
        int databaseSizeBeforeUpdate = acheterRepository.findAll().size();
        acheter.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAcheterMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(acheter))
            )
            .andExpect(status().isBadRequest());

        // Validate the Acheter in the database
        List<Acheter> acheterList = acheterRepository.findAll();
        assertThat(acheterList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAcheter() throws Exception {
        int databaseSizeBeforeUpdate = acheterRepository.findAll().size();
        acheter.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAcheterMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(acheter)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Acheter in the database
        List<Acheter> acheterList = acheterRepository.findAll();
        assertThat(acheterList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAcheter() throws Exception {
        // Initialize the database
        acheterRepository.saveAndFlush(acheter);

        int databaseSizeBeforeDelete = acheterRepository.findAll().size();

        // Delete the acheter
        restAcheterMockMvc
            .perform(delete(ENTITY_API_URL_ID, acheter.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Acheter> acheterList = acheterRepository.findAll();
        assertThat(acheterList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
