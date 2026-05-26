package com.food.restaurant.controller;

import com.food.restaurant.dto.MenuItemDto;
import com.food.restaurant.dto.RestaurantDto;
import com.food.restaurant.service.RestaurantService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller layer exposing endpoints for retrieving/modifying Restaurants and Menu details.
 */
@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Slf4j
public class RestaurantController {

    private final RestaurantService restaurantService;

    @GetMapping("/restaurants")
    public ResponseEntity<List<RestaurantDto>> getAllRestaurants(
            @RequestParam(required = false) String search
    ) {
        if (search != null && !search.trim().isEmpty()) {
            log.info("REST request to search restaurants: {}", search);
            return ResponseEntity.ok(restaurantService.searchRestaurants(search));
        }
        log.info("REST request to fetch all restaurants");
        return ResponseEntity.ok(restaurantService.getAllRestaurants());
    }

    @GetMapping("/restaurants/{id}")
    public ResponseEntity<RestaurantDto> getRestaurantById(@PathVariable Long id) {
        log.info("REST request to fetch restaurant details: {}", id);
        return ResponseEntity.ok(restaurantService.getRestaurantById(id));
    }

    @PostMapping("/restaurants")
    public ResponseEntity<RestaurantDto> createRestaurant(@RequestBody RestaurantDto dto) {
        log.info("REST request to create restaurant: {}", dto.name());
        return ResponseEntity.ok(restaurantService.createRestaurant(dto));
    }

    @PostMapping("/restaurants/{id}/menu")
    public ResponseEntity<MenuItemDto> addMenuItem(
            @PathVariable Long id,
            @RequestBody MenuItemDto dto
    ) {
        log.info("REST request to add menu item to restaurant: {}", id);
        return ResponseEntity.ok(restaurantService.addMenuItem(id, dto));
    }

    @PutMapping("/menu-items/{itemId}/availability")
    public ResponseEntity<MenuItemDto> updateMenuItemAvailability(
            @PathVariable Long itemId,
            @RequestParam boolean available
    ) {
        log.info("REST request to update availability of menu item: {}", itemId);
        return ResponseEntity.ok(restaurantService.updateMenuItemAvailability(itemId, available));
    }
}
