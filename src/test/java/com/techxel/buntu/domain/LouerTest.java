package com.techxel.buntu.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.techxel.buntu.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class LouerTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Louer.class);
        Louer louer1 = new Louer();
        louer1.setId(1L);
        Louer louer2 = new Louer();
        louer2.setId(louer1.getId());
        assertThat(louer1).isEqualTo(louer2);
        louer2.setId(2L);
        assertThat(louer1).isNotEqualTo(louer2);
        louer1.setId(null);
        assertThat(louer1).isNotEqualTo(louer2);
    }
}
