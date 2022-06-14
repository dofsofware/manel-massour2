package com.techxel.buntu.repository;

import com.techxel.buntu.domain.Propriete;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Propriete entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ProprieteRepository extends JpaRepository<Propriete, Long> {}
