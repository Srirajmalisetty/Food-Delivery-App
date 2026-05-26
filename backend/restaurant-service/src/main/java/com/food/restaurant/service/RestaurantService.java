package com.food.restaurant.service;

import com.food.restaurant.dto.MenuItemDto;
import com.food.restaurant.dto.RestaurantDto;
import com.food.restaurant.model.MenuItem;
import com.food.restaurant.model.Restaurant;
import com.food.restaurant.repository.MenuItemRepository;
import com.food.restaurant.repository.RestaurantRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Enterprise service handling restaurant and menu operations.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class RestaurantService {

    private final RestaurantRepository restaurantRepository;
    private final MenuItemRepository menuItemRepository;

    public List<RestaurantDto> getAllRestaurants() {
        log.info("Fetching all restaurants from PostgreSQL");
        return restaurantRepository.findAll().stream()
                .map(this::mapToRestaurantDto)
                .collect(Collectors.toList());
    }

    public List<RestaurantDto> searchRestaurants(String query) {
        log.info("Searching restaurants with query: {}", query);
        return restaurantRepository.findByNameContainingIgnoreCaseOrCuisineContainingIgnoreCase(query, query)
                .stream()
                .map(this::mapToRestaurantDto)
                .collect(Collectors.toList());
    }

    public RestaurantDto getRestaurantById(Long id) {
        log.info("Fetching restaurant by id: {}", id);
        Restaurant restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Restaurant not found with id: " + id));
        return mapToRestaurantDto(restaurant);
    }

    @Transactional
    public RestaurantDto createRestaurant(RestaurantDto dto) {
        log.info("Creating new restaurant: {}", dto.name());
        Restaurant restaurant = Restaurant.builder()
                .name(dto.name())
                .cuisine(dto.cuisine())
                .address(dto.address())
                .phone(dto.phone())
                .rating(dto.rating() != null ? dto.rating() : 0.0)
                .build();

        Restaurant savedRestaurant = restaurantRepository.save(restaurant);
        return mapToRestaurantDto(savedRestaurant);
    }

    @Transactional
    public MenuItemDto addMenuItem(Long restaurantId, MenuItemDto dto) {
        log.info("Adding menu item: {} to restaurant: {}", dto.name(), restaurantId);
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new IllegalArgumentException("Restaurant not found with id: " + restaurantId));

        MenuItem menuItem = MenuItem.builder()
                .name(dto.name())
                .description(dto.description())
                .price(dto.price())
                .category(dto.category())
                .available(dto.available() != null ? dto.available() : true)
                .restaurant(restaurant)
                .build();

        MenuItem savedItem = menuItemRepository.save(menuItem);
        return mapToMenuItemDto(savedItem);
    }

    @Transactional
    public MenuItemDto updateMenuItemAvailability(Long itemId, boolean available) {
        log.info("Updating availability of item: {} to: {}", itemId, available);
        MenuItem menuItem = menuItemRepository.findById(itemId)
                .orElseThrow(() -> new IllegalArgumentException("Menu item not found with id: " + itemId));
        menuItem.setAvailable(available);
        MenuItem updatedItem = menuItemRepository.save(menuItem);
        return mapToMenuItemDto(updatedItem);
    }

    private RestaurantDto mapToRestaurantDto(Restaurant restaurant) {
        List<MenuItemDto> menuList = restaurant.getMenu() != null ? restaurant.getMenu().stream()
                .map(this::mapToMenuItemDto)
                .collect(Collectors.toList()) : List.of();

        return new RestaurantDto(
                restaurant.getId(),
                restaurant.getName(),
                restaurant.getCuisine(),
                restaurant.getAddress(),
                restaurant.getPhone(),
                restaurant.getRating(),
                menuList
        );
    }

    private MenuItemDto mapToMenuItemDto(MenuItem item) {
        return new MenuItemDto(
                item.getId(),
                item.getName(),
                item.getDescription(),
                item.getPrice(),
                item.getCategory(),
                item.getAvailable()
        );
    }
}
