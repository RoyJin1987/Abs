package com.aibangsong.abs;

import java.util.List;

public class Country extends AddressListItem{
	
	private List<Province> provinces;

	public List<Province> getProvinces() {
		return provinces;
	}
	public void setProvinces(List<Province> provinces) {
		this.provinces = provinces;
	}
}
