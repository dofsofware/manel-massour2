package com.techxel.buntu.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.techxel.buntu.IntegrationTest;
import com.techxel.buntu.domain.Louer;
import com.techxel.buntu.repository.LouerRepository;
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
 * Integration tests for the {@link LouerResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class LouerResourceIT {

    private static final String ENTITY_API_URL = "/api/louers";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private LouerRepository louerRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restLouerMockMvc;

    private Louer louer;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Louer createEntity(EntityManager em) {
        Louer louer = new Louer();
        return louer;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Louer createUpdatedEntity(EntityManager em) {
        Louer louer = new Louer();
        return louer;
    }

    @BeforeEach
    public void initTest() {
        louer = createEntity(em);
    }

    @Test
    @Transactional
    void createLouer() throws Exception {
        int databaseSizeBeforeCreate = louerRepository.findAll().size();
        // Create the Louer
        restLouerMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(louer)))
            .andExpect(status().isCreated());

        // Validate the Louer in the database
        List<Louer> louerList = louerRepository.findAll();
        assertThat(louerList).hasSize(databaseSizeBeforeCreate + 1);
        Louer testLouer = louerList.get(louerList.size() - 1);
    }

    @Test
    @Transactional
    void createLouerWithExistingId() throws Exception {
        // Create the Louer with an existing ID
        louer.setId(1L);

        int databaseSizeBeforeCreate = louerRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restLouerMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(louer)))
            .andExpect(status().isBadRequest());

        // Validate the Louer in the database
        List<Louer> louerList = louerRepository.findAll();
        assertThat(louerList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllLouers() throws Exception {
        // Initialize the database
        louerRepository.saveAndFlush(louer);

        // Get all the louerList
        restLouerMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(louer.getId().intValue())));
    }

    @Test
    @Transactional
    void getLouer() throws Exception {
        // Initialize the database
        louerRepository.saveAndFlush(louer);

        // Get the louer
        restLouerMockMvc
            .perform(get(ENTITY_API_URL_ID, louer.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(louer.getId().intValue()));
    }

    @Test
    @Transactional
    void getNonExistingLouer() throws Exception {
        // Get the louer
        restLouerMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewLouer() throws Exception {
        // Initialize the database
        louerRepository.saveAndFlush(louer);

        int databaseSizeBeforeUpdate = louerRepository.findAll().size();

        // Update the louer
        Louer updatedLouer = louerRepository.findById(louer.getId()).get();
        // Disconnect from session so that the updates on updatedLouer are not directly saved in db
        em.detach(updatedLouer);

        restLouerMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedLouer.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedLouer))
            )
            .andExpect(status().isOk());

        // Validate the Louer in the database
        List<Louer> louerList = louerRepository.findAll();
        assertThat(louerList).hasSize(databaseSizeBeforeUpdate);
        Louer testLouer = louerList.get(louerList.size() - 1);
    }

    @Test
    @Transactional
    void putNonExistingLouer() throws Exception {
        int databaseSizeBeforeUpdate = louerRepository.findAll().size();
        louer.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLouerMockMvc
            .perform(
                put(ENTITY_API_URL_ID, louer.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(louer))
            )
            .andExpect(status().isBadRequest());

        // Validate the Louer in the database
        List<Louer> louerList = louerRepository.findAll();
        assertThat(louerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchLouer() throws Exception {
        int databaseSizeBeforeUpdate = louerRepository.findAll().size();
        louer.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLouerMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(louer))
            )
            .andExpect(status().isBadRequest());

        // Validate the Louer in the database
        List<Louer> louerList = louerRepository.findAll();
        assertThat(louerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamLouer() throws Exception {
        int databaseSizeBeforeUpdate = louerRepository.findAll().size();
        louer.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLouerMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(louer)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Louer in the database
        List<Louer> louerList = louerRepository.findAll();
        assertThat(louerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateLouerWithPatch() throws Exception {
        // Initialize the database
        louerRepository.saveAndFlush(louer);

        int databaseSizeBeforeUpdate = louerRepository.findAll().size();

        // Update the louer using partial update
        Louer partialUpdatedLouer = new Louer();
        partialUpdatedLouer.setId(louer.getId());

        restLouerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLouer.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedLouer))
            )
            .andExpect(status().isOk());

        // Validate the Louer in the database
        List<Louer> louerList = louerRepository.findAll();
        assertThat(louerList).hasSize(databaseSizeBeforeUpdate);
        Louer testLouer = louerList.get(louerList.size() - 1);
    }

    @Test
    @Transactional
    void fullUpdateLouerWithPatch() throws Exception {
        // Initialize the database
        louerRepository.saveAndFlush(louer);

        int databaseSizeBeforeUpdate = louerRepository.findAll().size();

        // Update the louer using partial update
        Louer partialUpdatedLouer = new Louer();
        partialUpdatedLouer.setId(louer.getId());

        restLouerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLouer.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedLouer))
            )
            .andExpect(status().isOk());

        // Validate the Louer in the database
        List<Louer> louerList = louerRepository.findAll();
        assertThat(louerList).hasSize(databaseSizeBeforeUpdate);
        Louer testLouer = louerList.get(louerList.size() - 1);
    }

    @Test
    @Transactional
    void patchNonExistingLouer() throws Exception {
        int databaseSizeBeforeUpdate = louerRepository.findAll().size();
        louer.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLouerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, louer.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(louer))
            )
            .andExpect(status().isBadRequest());

        // Validate the Louer in the database
        List<Louer> louerList = louerRepository.findAll();
        assertThat(louerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchLouer() throws Exception {
        int databaseSizeBeforeUpdate = louerRepository.findAll().size();
        louer.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLouerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(louer))
            )
            .andExpect(status().isBadRequest());

        // Validate the Louer in the database
        List<Louer> louerList = louerRepository.findAll();
        assertThat(louerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamLouer() throws Exception {
        int databaseSizeBeforeUpdate = louerRepository.findAll().size();
        louer.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLouerMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(louer)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Louer in the database
        List<Louer> louerList = louerRepository.findAll();
        assertThat(louerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteLouer() throws Exception {
        // Initialize the database
        louerRepository.saveAndFlush(louer);

        int databaseSizeBeforeDelete = louerRepository.findAll().size();

        // Delete the louer
        restLouerMockMvc
            .perform(delete(ENTITY_API_URL_ID, louer.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Louer> louerList = louerRepository.findAll();
        assertThat(louerList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
