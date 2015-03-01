package com.nheir.velomap;

import android.app.Activity;
import android.content.Context;
import android.content.SharedPreferences;
import android.os.AsyncTask;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.webkit.WebSettings;
import android.webkit.WebView;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

public class MainView extends Activity {
    public static final String PREFS_NAME = "Pref";
    public int ville;
    public WebView mMap;

    public void loadHtmlWithJs(int id) {
        String jsfile = "";
        ville = id;
        switch (id) {
            case R.id.lyon:
                jsfile = "map.js";
                break;
            case R.id.bordeaux:
                jsfile = "map_bordeaux.js";
                break;
            default:
                ville = R.id.lyon;
                jsfile = "map.js";
        }
        String html = "<!DOCTYPE html><html><head><meta charset=\"UTF-8\">" +
                "<link rel=\"stylesheet\" href=\"./css/leaflet.css\" />" +
                "<link rel=\"stylesheet\" href=\"./css/style.css\" />" +
                "<script type=\"text/javascript\" src=\"./js/leaflet.js\"></script>" +
                "<script type=\"text/javascript\" src=\"./js/jquery.min.js\"></script>" +
                "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no\" />" +
                "</head><body><div id=\"map\"></div>" +
                "<script type=\"text/javascript\" src=\"./js/"+jsfile+"\"></script>" +
                "</body></html>";
        mMap.loadDataWithBaseURL("file:///android_asset/", html, "text/html", "UTF-8", "");
    }
	
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.map);
		mMap = (WebView) findViewById(R.id.webview);
		
		WebSettings webSettings = mMap.getSettings();
		webSettings.setJavaScriptEnabled(true);
		mMap.addJavascriptInterface(new WebAppInterface(this), "Android");

        SharedPreferences settings = getSharedPreferences(PREFS_NAME, 0);
        ville = settings.getInt("lastCity", R.id.lyon);

        loadHtmlWithJs(ville);
	}

    @Override
    protected void onStop(){
        super.onStop();

        SharedPreferences settings = getSharedPreferences(PREFS_NAME, 0);
        SharedPreferences.Editor editor = settings.edit();
        editor.putInt("lastCity", ville);

        editor.commit();
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        MenuInflater inflater = getMenuInflater();
        inflater.inflate(R.menu.menu, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle item selection
        switch (item.getItemId()) {
            case R.id.lyon:
            case R.id.bordeaux:
                loadHtmlWithJs(item.getItemId());
                return true;
            default:
                return super.onOptionsItemSelected(item);
        }
    }

    public class WebAppInterface {
        private Context mcontext = null;
        private String data = "";

        WebAppInterface(Context c) {
            mcontext = c;
        }

        //@android.webkit.JavascriptInterface
        public void getBordeaux(String fname) throws IOException {
            String key = mcontext.getString(R.string.bordeaux_key);
            String urlString = "http://data.bordeaux-metropole.fr/wfs?key=" + key + "&service=wfs&version=1.1.0&request=GetFeature&typeName=CI_VCUB_P&srsname=epsg:4326";
            new DownloadWebpageTask().execute(urlString, fname);
        }

        public String getData() {
            return data;
        }

        public void getLyon(String fname) {
            String key = mcontext.getString(R.string.jcdecaux_key);
            String urlString = "https://api.jcdecaux.com/vls/v1/stations?contract=Lyon&apiKey="+key;
            new DownloadWebpageTask().execute(urlString, fname);
        }

        private String downloadUrl(String urlString) throws IOException {
            URL url = new URL(urlString);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setReadTimeout(10000 /* milliseconds */);
            conn.setConnectTimeout(15000 /* milliseconds */);
            conn.setRequestMethod("GET");
            conn.setDoInput(true);
            // Starts the query
            conn.connect();

            InputStream stream = conn.getInputStream();
            data = "";
            BufferedReader r = new BufferedReader(new InputStreamReader(stream));
            StringBuilder total = new StringBuilder();
            String line;
            while ((line = r.readLine()) != null) {
                total.append(line);
            }
            data = total.toString();
            if (stream != null) {
                stream.close();
            }
            return data;
        }

        private class DownloadWebpageTask extends AsyncTask<String, Void, String> {
            private String callback = null;

            @Override
            protected String doInBackground(String... urls) {
                callback = urls[1];
                try {
                    return downloadUrl(urls[0]);
                } catch (IOException e) {
                    return "Unable to retrieve web page. URL may be invalid.";
                }
            }

            // onPostExecute displays the results of the AsyncTask.
            @Override
            protected void onPostExecute(String result) {
                String js = "javascript:"+callback+"();";
                data = result;
                mMap.loadUrl(js);
            }
        }
    }
}
