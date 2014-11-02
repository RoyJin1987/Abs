package com.aibangsong.abs;

import java.io.IOException;
import java.io.InputStream;

import com.thoughtworks.xstream.XStream;

public class AddressDAO {

	public Country retrieveCountry(InputStream is){
		
		Country country = null;
		
		try {

			XStream xStream = new XStream();
			xStream.alias("country", Country.class);
			xStream.alias("province", Province.class);
			xStream.alias("city", City.class);
			xStream.alias("county", County.class);
			xStream.addImplicitCollection(Country.class, "provinces",Province.class);
			xStream.addImplicitCollection(Province.class, "cities",City.class);
			xStream.addImplicitCollection(City.class, "counties",County.class);
			xStream.useAttributeFor(Province.class, "value");
			xStream.useAttributeFor(Province.class, "code");
			country = (Country) xStream.fromXML(is,
					country);
		} catch (Exception ex) {
			ex.printStackTrace();
		} finally {
				try {
					if (is != null){
						is.close();
					}
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		return country;
	}

}
