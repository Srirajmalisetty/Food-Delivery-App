package com.food.restaurant.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

/**
 * Restaurant Entity mapping postgres database properties.
 */
@Entity
@Table(name = "restaurants")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Restaurant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String cuisine;

    @Column(nullable = false)
    private String address;

    private String phone;

    private Double rating;

    @OneToMany(mappedBy = "restaurant", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    @ToString.Exclude
    private List<MenuItem> menu = new ArrayList<>();
}
