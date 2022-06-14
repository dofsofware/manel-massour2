package com.techxel.buntu.repository;

import com.techxel.buntu.domain.Estimer;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Estimer entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EstimerRepository extends JpaRepository<Estimer, Long> {}
