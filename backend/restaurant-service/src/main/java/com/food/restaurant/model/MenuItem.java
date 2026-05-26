package com.food.restaurant.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

/**
 * MenuItem Entity modeling individual dishes on menu cards.
 */
@Entity
@Table(name = "menu_items")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MenuItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String description;

    @Column(nullable = false)
    private BigDecimal price;

    private String category;

    @Column(nullable = false)
    @Builder.Default
    private Boolean available = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "restaurant_id", nullable = false)
    @JsonIgnore
    @ToString.Exclude
    private Restaurant restaurant;
}
