package com.mertg.drawcameraapp

import android.Manifest
import android.content.pm.PackageManager
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.addCallback
import androidx.activity.compose.setContent
import androidx.activity.result.contract.ActivityResultContracts
import androidx.activity.viewModels
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.WindowInsetsControllerCompat
import androidx.lifecycle.lifecycleScope
import com.mertg.drawcameraapp.view.MainContent
import com.mertg.drawcameraapp.viewmodel.MainViewModel
import java.io.File

class MainActivity : ComponentActivity() {

    private val viewModel by viewModels<MainViewModel>()

    private val requestPermissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { isGranted ->
        if (isGranted) {
            viewModel.initializeCamera()
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Tam ekran modunu etkinleştirmek
        WindowCompat.setDecorFitsSystemWindows(window, false)
        val windowInsetsController = WindowInsetsControllerCompat(window, window.decorView)
        windowInsetsController.hide(WindowInsetsCompat.Type.systemBars())
        windowInsetsController.systemBarsBehavior = WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE

        setContent {
            MainContent()
        }

        requestCameraPermission()
        viewModel.getDirectoryFile(applicationContext)
        viewModel.initializeCameraExecutor()

        // Geri tuşunu devre dışı bırakmak
        onBackPressedDispatcher.addCallback(this) {
            // Hiçbir şey yapma
        }

        // Geçici dosyaları sil
        deleteTemporaryFiles()
    }

    private fun deleteTemporaryFiles() {
        // Geçici dosyaların saklandığı klasör yolu
        val tempFilesDirectory = File(getExternalFilesDir(null), "TempImages")
        if (tempFilesDirectory.exists()) {
            tempFilesDirectory.listFiles()?.forEach { file ->
                if (file.name.startsWith("temp_")) {  // Geçici dosyaların adı 'temp_' ile başlıyorsa
                    file.delete()
                }
            }
        }
    }

    private fun requestCameraPermission() {
        when {
            ContextCompat.checkSelfPermission(
                this,
                Manifest.permission.CAMERA
            ) == PackageManager.PERMISSION_GRANTED -> {
                viewModel.initializeCamera()
            }

            ActivityCompat.shouldShowRequestPermissionRationale(
                this,
                Manifest.permission.CAMERA
            ) -> {}

            else -> requestPermissionLauncher.launch(Manifest.permission.CAMERA)
        }
    }
}
