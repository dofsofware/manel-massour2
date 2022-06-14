package com.techxel.buntu.repository;

import com.techxel.buntu.domain.Apropos;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Apropos entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AproposRepository extends JpaRepository<Apropos, Long> {}
