package com.techxel.buntu.repository;

import com.techxel.buntu.domain.Recherche;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Recherche entity.
 */
@SuppressWarnings("unused")
@Repository
public interface RechercheRepository extends JpaRepository<Recherche, Long> {}
