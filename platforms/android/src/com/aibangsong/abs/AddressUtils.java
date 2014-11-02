package com.aibangsong.abs;

import java.io.IOException;
import java.io.InputStream;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public class AddressUtils {

	public Country getCountry(InputStream inputStream) throws IOException {
		AddressDAO dao = new AddressDAO();

		Country country = dao.retrieveCountry(inputStream);
		if (inputStream != null) {
			inputStream.close();
		}
		
		return country;
	}

	public Map<String, String> getProvince(Country country) throws IOException {
		Map<String, String> provinceMap = new LinkedHashMap<String, String>();
		List<Province> listProvince = country.getProvinces();

		for (Province province : listProvince) {
			provinceMap.put(province.getValue(), province.getCode());
		}

		return provinceMap;
	}

	public Map<String, String> getCity(Country country,String provinceCode) {
		Map<String, String> cityMap = new LinkedHashMap<String, String>();

		List<Province> listProvince = country.getProvinces();

		for (Province province : listProvince) {
			if (province.getCode().equals(provinceCode)) {
				for (City city : province.getCities()) {
					cityMap.put(city.getValue(), city.getCode());
				}
				break;
			}
		}

		return cityMap;
	}

	public Map<String, String> getArea(Country country,String cityCode) {
		Map<String, String> areaMap = new LinkedHashMap<String, String>();

		List<Province> listProvince = country.getProvinces();

		for (Province province : listProvince) {
			for (City city : province.getCities()) {
				if (city.getCode().equals(cityCode)) {
					for (County area : city.getCounties()){
						areaMap.put(area.getValue(), area.getCode());
					}
					return areaMap;
				}
			}
		}

		return areaMap;
	}
}
