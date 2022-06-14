package com.techxel.buntu.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.techxel.buntu.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class EstimerTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Estimer.class);
        Estimer estimer1 = new Estimer();
        estimer1.setId(1L);
        Estimer estimer2 = new Estimer();
        estimer2.setId(estimer1.getId());
        assertThat(estimer1).isEqualTo(estimer2);
        estimer2.setId(2L);
        assertThat(estimer1).isNotEqualTo(estimer2);
        estimer1.setId(null);
        assertThat(estimer1).isNotEqualTo(estimer2);
    }
}
