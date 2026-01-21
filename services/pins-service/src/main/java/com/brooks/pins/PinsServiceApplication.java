package com.brooks.pins;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class PinsServiceApplication {
  public static void main(String[] args) {
    SpringApplication.run(PinsServiceApplication.class, args);
  }
}
