package com.techxel.buntu.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.techxel.buntu.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class AcheterTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Acheter.class);
        Acheter acheter1 = new Acheter();
        acheter1.setId(1L);
        Acheter acheter2 = new Acheter();
        acheter2.setId(acheter1.getId());
        assertThat(acheter1).isEqualTo(acheter2);
        acheter2.setId(2L);
        assertThat(acheter1).isNotEqualTo(acheter2);
        acheter1.setId(null);
        assertThat(acheter1).isNotEqualTo(acheter2);
    }
}
