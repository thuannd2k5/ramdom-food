import { Test, TestingModule } from '@nestjs/testing';
import { PlacesService } from './places.service';

describe('PlacesService', () => {
  let service: PlacesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlacesService],
    }).compile();

    service = module.get<PlacesService>(PlacesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('calculateDistanceMeters', () => {
    it('should return approximately 0 when coordinates are identical', () => {
      const distance = service.calculateDistanceMeters(21.0285, 105.8542, 21.0285, 105.8542);
      expect(distance).toBe(0);
    });

    it('should accurately calculate distance between two coordinates in Hanoi', () => {
      // Hồ Gươm (21.0285, 105.8542) tới Nhà Hát Lớn (21.0244, 105.8576) ~ 580m
      const distance = service.calculateDistanceMeters(21.0285, 105.8542, 21.0244, 105.8576);
      expect(distance).toBeGreaterThan(450);
      expect(distance).toBeLessThan(750);
    });
  });

  describe('getNearbyPlaces', () => {
    it('should return a list of nearby places with distance and Google Maps URL', async () => {
      const result = await service.getNearbyPlaces({
        lat: 21.0285,
        lng: 105.8542,
        foodName: 'Bún chả',
        radius: 3000,
      });

      expect(result).toBeDefined();
      expect(result.foodName).toBe('Bún chả');
      expect(Array.isArray(result.places)).toBe(true);
      expect(result.places.length).toBeGreaterThan(0);

      const firstPlace = result.places[0];
      expect(firstPlace).toHaveProperty('name');
      expect(firstPlace).toHaveProperty('address');
      expect(firstPlace).toHaveProperty('distanceMeters');
      expect(firstPlace).toHaveProperty('googleMapsUrl');
      expect(firstPlace.googleMapsUrl).toContain('google.com/maps');

      // Danh sách phải được sắp xếp theo khoảng cách tăng dần
      for (let i = 0; i < result.places.length - 1; i++) {
        expect(result.places[i].distanceMeters).toBeLessThanOrEqual(
          result.places[i + 1].distanceMeters,
        );
      }
    });
  });
});
