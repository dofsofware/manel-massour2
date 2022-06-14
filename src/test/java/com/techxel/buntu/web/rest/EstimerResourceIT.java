package com.techxel.buntu.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.techxel.buntu.IntegrationTest;
import com.techxel.buntu.domain.Estimer;
import com.techxel.buntu.repository.EstimerRepository;
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
 * Integration tests for the {@link EstimerResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class EstimerResourceIT {

    private static final String ENTITY_API_URL = "/api/estimers";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private EstimerRepository estimerRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restEstimerMockMvc;

    private Estimer estimer;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Estimer createEntity(EntityManager em) {
        Estimer estimer = new Estimer();
        return estimer;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Estimer createUpdatedEntity(EntityManager em) {
        Estimer estimer = new Estimer();
        return estimer;
    }

    @BeforeEach
    public void initTest() {
        estimer = createEntity(em);
    }

    @Test
    @Transactional
    void createEstimer() throws Exception {
        int databaseSizeBeforeCreate = estimerRepository.findAll().size();
        // Create the Estimer
        restEstimerMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(estimer)))
            .andExpect(status().isCreated());

        // Validate the Estimer in the database
        List<Estimer> estimerList = estimerRepository.findAll();
        assertThat(estimerList).hasSize(databaseSizeBeforeCreate + 1);
        Estimer testEstimer = estimerList.get(estimerList.size() - 1);
    }

    @Test
    @Transactional
    void createEstimerWithExistingId() throws Exception {
        // Create the Estimer with an existing ID
        estimer.setId(1L);

        int databaseSizeBeforeCreate = estimerRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restEstimerMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(estimer)))
            .andExpect(status().isBadRequest());

        // Validate the Estimer in the database
        List<Estimer> estimerList = estimerRepository.findAll();
        assertThat(estimerList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllEstimers() throws Exception {
        // Initialize the database
        estimerRepository.saveAndFlush(estimer);

        // Get all the estimerList
        restEstimerMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(estimer.getId().intValue())));
    }

    @Test
    @Transactional
    void getEstimer() throws Exception {
        // Initialize the database
        estimerRepository.saveAndFlush(estimer);

        // Get the estimer
        restEstimerMockMvc
            .perform(get(ENTITY_API_URL_ID, estimer.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(estimer.getId().intValue()));
    }

    @Test
    @Transactional
    void getNonExistingEstimer() throws Exception {
        // Get the estimer
        restEstimerMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewEstimer() throws Exception {
        // Initialize the database
        estimerRepository.saveAndFlush(estimer);

        int databaseSizeBeforeUpdate = estimerRepository.findAll().size();

        // Update the estimer
        Estimer updatedEstimer = estimerRepository.findById(estimer.getId()).get();
        // Disconnect from session so that the updates on updatedEstimer are not directly saved in db
        em.detach(updatedEstimer);

        restEstimerMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedEstimer.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedEstimer))
            )
            .andExpect(status().isOk());

        // Validate the Estimer in the database
        List<Estimer> estimerList = estimerRepository.findAll();
        assertThat(estimerList).hasSize(databaseSizeBeforeUpdate);
        Estimer testEstimer = estimerList.get(estimerList.size() - 1);
    }

    @Test
    @Transactional
    void putNonExistingEstimer() throws Exception {
        int databaseSizeBeforeUpdate = estimerRepository.findAll().size();
        estimer.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEstimerMockMvc
            .perform(
                put(ENTITY_API_URL_ID, estimer.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(estimer))
            )
            .andExpect(status().isBadRequest());

        // Validate the Estimer in the database
        List<Estimer> estimerList = estimerRepository.findAll();
        assertThat(estimerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchEstimer() throws Exception {
        int databaseSizeBeforeUpdate = estimerRepository.findAll().size();
        estimer.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEstimerMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(estimer))
            )
            .andExpect(status().isBadRequest());

        // Validate the Estimer in the database
        List<Estimer> estimerList = estimerRepository.findAll();
        assertThat(estimerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamEstimer() throws Exception {
        int databaseSizeBeforeUpdate = estimerRepository.findAll().size();
        estimer.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEstimerMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(estimer)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Estimer in the database
        List<Estimer> estimerList = estimerRepository.findAll();
        assertThat(estimerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateEstimerWithPatch() throws Exception {
        // Initialize the database
        estimerRepository.saveAndFlush(estimer);

        int databaseSizeBeforeUpdate = estimerRepository.findAll().size();

        // Update the estimer using partial update
        Estimer partialUpdatedEstimer = new Estimer();
        partialUpdatedEstimer.setId(estimer.getId());

        restEstimerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEstimer.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedEstimer))
            )
            .andExpect(status().isOk());

        // Validate the Estimer in the database
        List<Estimer> estimerList = estimerRepository.findAll();
        assertThat(estimerList).hasSize(databaseSizeBeforeUpdate);
        Estimer testEstimer = estimerList.get(estimerList.size() - 1);
    }

    @Test
    @Transactional
    void fullUpdateEstimerWithPatch() throws Exception {
        // Initialize the database
        estimerRepository.saveAndFlush(estimer);

        int databaseSizeBeforeUpdate = estimerRepository.findAll().size();

        // Update the estimer using partial update
        Estimer partialUpdatedEstimer = new Estimer();
        partialUpdatedEstimer.setId(estimer.getId());

        restEstimerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEstimer.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedEstimer))
            )
            .andExpect(status().isOk());

        // Validate the Estimer in the database
        List<Estimer> estimerList = estimerRepository.findAll();
        assertThat(estimerList).hasSize(databaseSizeBeforeUpdate);
        Estimer testEstimer = estimerList.get(estimerList.size() - 1);
    }

    @Test
    @Transactional
    void patchNonExistingEstimer() throws Exception {
        int databaseSizeBeforeUpdate = estimerRepository.findAll().size();
        estimer.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEstimerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, estimer.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(estimer))
            )
            .andExpect(status().isBadRequest());

        // Validate the Estimer in the database
        List<Estimer> estimerList = estimerRepository.findAll();
        assertThat(estimerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchEstimer() throws Exception {
        int databaseSizeBeforeUpdate = estimerRepository.findAll().size();
        estimer.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEstimerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(estimer))
            )
            .andExpect(status().isBadRequest());

        // Validate the Estimer in the database
        List<Estimer> estimerList = estimerRepository.findAll();
        assertThat(estimerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamEstimer() throws Exception {
        int databaseSizeBeforeUpdate = estimerRepository.findAll().size();
        estimer.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEstimerMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(estimer)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Estimer in the database
        List<Estimer> estimerList = estimerRepository.findAll();
        assertThat(estimerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteEstimer() throws Exception {
        // Initialize the database
        estimerRepository.saveAndFlush(estimer);

        int databaseSizeBeforeDelete = estimerRepository.findAll().size();

        // Delete the estimer
        restEstimerMockMvc
            .perform(delete(ENTITY_API_URL_ID, estimer.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Estimer> estimerList = estimerRepository.findAll();
        assertThat(estimerList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
