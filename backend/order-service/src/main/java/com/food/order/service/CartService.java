package com.food.order.service;

import com.food.order.dto.CartDto;
import com.food.order.model.Cart;
import com.food.order.model.CartItem;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service managing Redis operations for stateful shopping carts.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class CartService {

    private static final String CART_PREFIX = "cart::";
    private final RedisTemplate<String, Object> redisTemplate;

    public CartDto getCart(Long customerId) {
        log.info("Fetching cart details from Redis cache for customer: {}", customerId);
        Cart cart = (Cart) redisTemplate.opsForValue().get(CART_PREFIX + customerId);
        
        if (cart == null) {
            cart = Cart.builder()
                    .customerId(customerId)
                    .items(new ArrayList<>())
                    .build();
        }
        return mapToDto(cart);
    }

    public CartDto addToCart(Long customerId, Long restaurantId, String restaurantName, CartDto.CartItemDto itemDto) {
        log.info("Adding item to cart for customer: {} from restaurant: {}", customerId, restaurantId);
        String cartKey = CART_PREFIX + customerId;
        Cart cart = (Cart) redisTemplate.opsForValue().get(cartKey);

        if (cart == null) {
            cart = Cart.builder()
                    .customerId(customerId)
                    .restaurantId(restaurantId)
                    .restaurantName(restaurantName)
                    .items(new ArrayList<>())
                    .build();
        } else if (!cart.getRestaurantId().equals(restaurantId)) {
            log.info("Resetting cart: item belongs to different restaurant than active selections");
            cart.setRestaurantId(restaurantId);
            cart.setRestaurantName(restaurantName);
            cart.setItems(new ArrayList<>());
        }

        // Add or update quantity
        List<CartItem> items = cart.getItems();
        boolean found = false;
        for (CartItem existingItem : items) {
            if (existingItem.getMenuItemId().equals(itemDto.menuItemId())) {
                existingItem.setQuantity(existingItem.getQuantity() + itemDto.quantity());
                found = true;
                break;
            }
        }

        if (!found) {
            items.add(CartItem.builder()
                    .menuItemId(itemDto.menuItemId())
                    .name(itemDto.name())
                    .price(itemDto.price())
                    .quantity(itemDto.quantity())
                    .build());
        }

        redisTemplate.opsForValue().set(cartKey, cart);
        return mapToDto(cart);
    }

    public CartDto clearCart(Long customerId) {
        log.info("Clearing cart contents from Redis for customer: {}", customerId);
        String cartKey = CART_PREFIX + customerId;
        redisTemplate.delete(cartKey);
        
        Cart emptyCart = Cart.builder()
                .customerId(customerId)
                .items(new ArrayList<>())
                .build();
        return mapToDto(emptyCart);
    }

    private CartDto mapToDto(Cart cart) {
        List<CartDto.CartItemDto> itemsList = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;

        if (cart.getItems() != null) {
            for (CartItem item : cart.getItems()) {
                BigDecimal subTotal = item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
                total = total.add(subTotal);
                itemsList.add(new CartDto.CartItemDto(
                        item.getMenuItemId(),
                        item.getName(),
                        item.getPrice(),
                        item.getQuantity(),
                        subTotal
                ));
            }
        }

        return new CartDto(
                cart.getCustomerId(),
                cart.getRestaurantId(),
                cart.getRestaurantName(),
                itemsList,
                total
        );
    }
}
