package com.food.restaurant.repository;

import com.food.restaurant.model.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Access interface managing query executions for Restaurants.
 */
@Repository
public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {
    List<Restaurant> findByNameContainingIgnoreCaseOrCuisineContainingIgnoreCase(String name, String cuisine);
}
