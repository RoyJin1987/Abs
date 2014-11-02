package com.aibangsong.abs;

import java.util.List;

public class Province extends AddressListItem{
	
	private List<City> cities;
	
	public List<City> getCities() {
		return cities;
	}
	public void setCities(List<City> cities) {
		this.cities = cities;
	}

}
