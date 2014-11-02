package com.aibangsong.abs;

import java.io.IOException;
import java.util.Map;

import kankan.wheel.widget.OnWheelScrollListener;
import kankan.wheel.widget.WheelView;
import kankan.wheel.widget.adapters.ArrayWheelAdapter;
import android.app.Dialog;
import android.content.Context;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

public class AddressPickerDialog extends Dialog {

	private Map<String, String> provinceMap;
	private Map<String, String> cityMap;
	private Map<String, String> areaMap;

	private String[] provinceArray;
	private String[] cityArray;
	private String[] areaArray;

	private WheelView provinceWheelView;
	private WheelView cityWheelView;
	private WheelView areaWheelView;

	private ProviceCityAreaAdapter provinceAdapter;
	private ProviceCityAreaAdapter cityAdapter;
	private ProviceCityAreaAdapter areaAdapter;
	private AddressUtils addressUtils = new AddressUtils();
	private Context applicationContext;
	private DialogListener dialogListener = null;
	private String province = null;
	private String city = null;
	private String county = null;
	private Country country = null;

	public AddressPickerDialog(Context context, DialogListener listener,
			String province, String city, String county, Country country) {
		super(context, R.style.AddressPickerDialog);
		applicationContext = context;
		this.dialogListener = listener;
		this.province = province;
		this.city = city;
		this.county = county;
		this.country = country;
	}

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.dialog_address_picker);

		initWheelView();

		findViewById(R.id.btnOK).setOnClickListener(new View.OnClickListener() {

			@Override
			public void onClick(View arg0) {
				dialogListener.setAddress(
						provinceMap.get(provinceArray[provinceWheelView
								.getCurrentItem()]),
						provinceArray[provinceWheelView.getCurrentItem()],
						cityMap.get(cityArray[cityWheelView.getCurrentItem()]),
						cityArray[cityWheelView.getCurrentItem()],
						areaMap.get(areaArray[areaWheelView.getCurrentItem()]),
						areaArray[areaWheelView.getCurrentItem()]);
				dismiss();
			}
		});
	}

	public void initWheelView() {
		provinceWheelView = (WheelView) findViewById(R.id.provice);
		cityWheelView = (WheelView) findViewById(R.id.city);
		areaWheelView = (WheelView) findViewById(R.id.area);

		// 设置选中的颜
		provinceWheelView.setCurrentColor(getContext().getResources().getColor(
				R.color.addresspickselect));
		cityWheelView.setCurrentColor(getContext().getResources().getColor(
				R.color.addresspickselect));
		areaWheelView.setCurrentColor(getContext().getResources().getColor(
				R.color.addresspickselect));

		initProviceMap();
		provinceAdapter = new ProviceCityAreaAdapter(applicationContext,
				provinceArray, 0);
		provinceAdapter.setItemResource(R.layout.address_text_view);
		provinceWheelView.setViewAdapter(provinceAdapter);

		if (province.isEmpty()) {
			provinceWheelView.setCurrentItem(0);

		} else {
			for (int i = 0; i < provinceArray.length; i++) {
				if (provinceArray[i].equals(province)) {
					provinceWheelView.setCurrentItem(i);
					break;
				}
			}
		}
		provinceWheelView.addScrollingListener(privinceScrollListener);

		String provinceCode = provinceMap.get(province);
		if (provinceCode == null || provinceCode.isEmpty()) {
			provinceCode = provinceMap.get(provinceArray[provinceWheelView
					.getCurrentItem()]);
		}
		initCityMap(provinceCode);

		cityAdapter = new ProviceCityAreaAdapter(applicationContext, cityArray,
				0);
		cityAdapter.setItemResource(R.layout.address_text_view);
		cityWheelView.setViewAdapter(cityAdapter);

		if (city.isEmpty()) {
			cityWheelView.setCurrentItem(0);

		} else {
			for (int i = 0; i < cityArray.length; i++) {
				if (cityArray[i].equals(city)) {
					cityWheelView.setCurrentItem(i);

					break;
				}
			}
		}

		cityWheelView.addScrollingListener(cityScrollListener);

		String cityCode = cityMap.get(city);
		if (cityCode == null || cityCode.isEmpty()) {
			cityCode = cityMap.get(cityArray[cityWheelView.getCurrentItem()]);
		}

		initAreaMap(cityCode);
		areaAdapter = new ProviceCityAreaAdapter(applicationContext, areaArray,
				0);
		areaAdapter.setItemResource(R.layout.address_text_view);
		areaWheelView.setViewAdapter(areaAdapter);

		if (county.isEmpty()) {
			areaWheelView.setCurrentItem(0);

		} else {
			for (int i = 0; i < areaArray.length; i++) {
				if (areaArray[i].equals(county)) {
					areaWheelView.setCurrentItem(i);
					break;
				}
			}
		}
	}

	OnWheelScrollListener privinceScrollListener = new OnWheelScrollListener() {

		@Override
		public void onScrollingStarted(WheelView wheel) {
		}

		@Override
		public void onScrollingFinished(WheelView wheel) {
			int currentItem = wheel.getCurrentItem();
			String provinceName = provinceArray[currentItem];
			String provinceCode = provinceMap.get(provinceName);
			initCityMap(provinceCode);

			cityAdapter = new ProviceCityAreaAdapter(applicationContext,
					cityArray, 0);
			cityAdapter.setItemResource(R.layout.address_text_view);
			cityWheelView.setViewAdapter(cityAdapter);
			cityWheelView.setCurrentItem(0);

			String cityName = cityArray[0];
			String cityCode = cityMap.get(cityName);

			initAreaMap(cityCode);
			areaAdapter = new ProviceCityAreaAdapter(applicationContext,
					areaArray, 0);
			areaAdapter.setItemResource(R.layout.address_text_view);
			areaWheelView.setViewAdapter(areaAdapter);
			areaWheelView.setCurrentItem(0);

		}
	};

	OnWheelScrollListener cityScrollListener = new OnWheelScrollListener() {

		@Override
		public void onScrollingStarted(WheelView wheel) {
		}

		@Override
		public void onScrollingFinished(WheelView wheel) {
			String cityCode = cityMap.get(cityArray[wheel.getCurrentItem()]);

			initAreaMap(cityCode);
			areaAdapter = new ProviceCityAreaAdapter(applicationContext,
					areaArray, 0);
			areaAdapter.setItemResource(R.layout.address_text_view);
			areaWheelView.setViewAdapter(areaAdapter);
			areaWheelView.setCurrentItem(0);

		}
	};

	public void initProviceMap() {
		try {

			provinceMap = addressUtils.getProvince(country);
			provinceArray = provinceMap.keySet().toArray(
					new String[provinceMap.size()]);

		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	public void initCityMap(String provinceCode) {
		cityMap = addressUtils.getCity(country, provinceCode);
		cityArray = cityMap.keySet().toArray(new String[cityMap.size()]);
	}

	public void initAreaMap(String cityCode) {
		areaMap = addressUtils.getArea(country, cityCode);
		areaArray = areaMap.keySet().toArray(new String[areaMap.size()]);
	}

	public class ProviceCityAreaAdapter extends ArrayWheelAdapter<String> {
		private int currentItem;
		private int currentValue;

		public ProviceCityAreaAdapter(Context context, String[] items,
				int current) {
			super(context, items);
			this.currentValue = current;
		}

		public void setCurrentValue(int value) {
			this.currentValue = value;
		}

		@Override
		protected void configureTextView(TextView view) {
			super.configureTextView(view);
			// view.setTypeface(Typeface.SANS_SERIF);
			// view.setEllipsize(TextUtils.TruncateAt.END);
			Log.d("address", "config");
		}

		@Override
		public View getItem(int index, View convertView, ViewGroup parent) {
			currentItem = index;
			View view = super.getItem(index, convertView, parent);
			view.setTag(index);
			return view;
		}

	}

}
