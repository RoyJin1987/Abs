package com.aibangsong.abs;

import java.util.List;

public class City extends AddressListItem{
	
	
	public List<County> getCounties() {
		return counties;
	}
	public void setCounties(List<County> counties) {
		this.counties = counties;
	}
	
	private List<County> counties;
}
