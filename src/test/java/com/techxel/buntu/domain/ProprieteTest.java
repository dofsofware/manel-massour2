package com.techxel.buntu.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.techxel.buntu.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ProprieteTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Propriete.class);
        Propriete propriete1 = new Propriete();
        propriete1.setId(1L);
        Propriete propriete2 = new Propriete();
        propriete2.setId(propriete1.getId());
        assertThat(propriete1).isEqualTo(propriete2);
        propriete2.setId(2L);
        assertThat(propriete1).isNotEqualTo(propriete2);
        propriete1.setId(null);
        assertThat(propriete1).isNotEqualTo(propriete2);
    }
}
