package com.mertg.drawcameraapp

import com.mertg.drawcameraapp.viewmodel.MainViewModel
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
import com.mertg.drawcameraapp.view.MainContent
import com.mertg.drawcameraapp.viewmodel.CameraViewViewModel

class MainActivity : ComponentActivity() {

    private val viewModel by viewModels<MainViewModel>()
    private val cameraViewViewModel by viewModels<CameraViewViewModel>()

    private val requestPermissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestPermission()
    ){ isGranted ->
        if (isGranted) {
            viewModel.initializeCamera()
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MainContent()
        }

        requestCameraPermission()
        viewModel.getDirectoryFile(applicationContext)
        viewModel.initializeCameraExecutor()

        onBackPressedDispatcher.addCallback(this) {
            viewModel.showPhoto.value = false
            viewModel.showCamera.value = true
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





