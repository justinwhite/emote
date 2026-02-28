package com.justinwhite.emote;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import com.justinwhite.emote.plugins.LocalAIPlugin;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(LocalAIPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
