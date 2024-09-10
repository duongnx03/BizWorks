package bizworks.backend.configs.Util;

import org.geotools.referencing.GeodeticCalculator;

public class GeoToolsDistanceCalculator {

    /**
     * Tính toán khoảng cách giữa hai điểm (lat1, lon1) và (lat2, lon2) bằng GeoTools.
     *
     * @param lat1 Vĩ độ của điểm 1
     * @param lon1 Kinh độ của điểm 1
     * @param lat2 Vĩ độ của điểm 2
     * @param lon2 Kinh độ của điểm 2
     * @return Khoảng cách giữa hai điểm tính bằng mét
     */
    public static double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        GeodeticCalculator calculator = new GeodeticCalculator();
        // Đặt điểm xuất phát (kinh độ, vĩ độ)
        calculator.setStartingGeographicPoint(lon1, lat1);
        // Đặt điểm đến (kinh độ, vĩ độ)
        calculator.setDestinationGeographicPoint(lon2, lat2);

        // Tính toán khoảng cách giữa hai điểm
        return calculator.getOrthodromicDistance(); // Khoảng cách tính bằng mét
    }
}
