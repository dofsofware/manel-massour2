package com.techxel.buntu.repository;

import com.techxel.buntu.domain.Acheter;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Acheter entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AcheterRepository extends JpaRepository<Acheter, Long> {}
