package com.techxel.buntu.repository;

import com.techxel.buntu.domain.Louer;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Louer entity.
 */
@SuppressWarnings("unused")
@Repository
public interface LouerRepository extends JpaRepository<Louer, Long> {}
