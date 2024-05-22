package com.mertg.drawcameraapp.view

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.gestures.detectDragGestures
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import androidx.lifecycle.viewmodel.compose.viewModel
import coil.compose.rememberImagePainter
import com.mertg.drawcameraapp.R
import com.mertg.drawcameraapp.model.Line
import com.mertg.drawcameraapp.util.getCurrentContext
import com.mertg.drawcameraapp.util.getScreenWidthPX
import com.mertg.drawcameraapp.util.photoWidthAndHeightForDisplay
import com.mertg.drawcameraapp.viewmodel.CameraViewViewModel
import com.mertg.drawcameraapp.viewmodel.DrawingMode
import com.mertg.drawcameraapp.viewmodel.DrawingScreenViewModel
import com.mertg.drawcameraapp.viewmodel.MainViewModel
import kotlin.math.hypot

@Composable
fun DrawingScreen() {
    val context = getCurrentContext()
    val mainViewModel: MainViewModel = viewModel()
    val drawingScreenViewModel: DrawingScreenViewModel = viewModel()
    val cameraViewViewModel: CameraViewViewModel = viewModel()

    val lines = drawingScreenViewModel.lines
    val (imageWidthToAspectRatio, imageHeightToAspectRatio) = drawingScreenViewModel.getBitmapSizeFromUri(context, mainViewModel.photoUri)
    val (photoWidthForDisplay, photoHeightForDisplay) = photoWidthAndHeightForDisplay(imageWidthToAspectRatio, imageHeightToAspectRatio)
    val imageWidthPx = getScreenWidthPX()
    val imageHeightPx = imageWidthPx * imageHeightToAspectRatio / imageWidthToAspectRatio

    var showStrokePicker by remember { mutableStateOf(false) }
    var showEraserSizePicker by remember { mutableStateOf(false) }

    Column(
        modifier = Modifier.fillMaxSize(),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .weight(0.5f),
            verticalAlignment = Alignment.Top,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            IconButton(
                onClick = { mainViewModel.goCameraScreenWithBack(context) },
                modifier = Modifier.padding(3.dp)
            ) {
                Icon(Icons.Filled.ArrowBackIosNew, "Geri")
            }

            IconButton(
                onClick = {
                    drawingScreenViewModel.lines.clear()
                },
                modifier = Modifier.padding(3.dp)
            ) {
                Icon(Icons.Filled.Delete, "Delete")
            }
        }

        Row(
            modifier = Modifier
                .width(photoWidthForDisplay)
                .height(photoHeightForDisplay)
                .weight(5.25f),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.Center
        ) {
            Box(
                modifier = Modifier.fillMaxSize(),
                contentAlignment = Alignment.Center
            ) {
                Image(
                    painter = rememberImagePainter(mainViewModel.photoUri),
                    contentDescription = null,
                    modifier = Modifier.graphicsLayer(scaleX = if (cameraViewViewModel.isCameraFront.value) -1f else 1f, scaleY = 1f)
                )

                Canvas(
                    modifier = Modifier
                        .fillMaxSize()
                        .pointerInput(true) {
                            detectDragGestures(
                                onDragStart = { offset ->
                                    if (drawingScreenViewModel.drawingMode.value == DrawingMode.ERASE) {
                                        drawingScreenViewModel.eraserPosition.value = offset
                                    }
                                },
                                onDrag = { change, dragAmount ->
                                    change.consume()
                                    val canvasSize = size
                                    if (change.position.x < 0f || change.position.x > canvasSize.width || change.position.y < 0f || change.position.y > canvasSize.height) {
                                        // Çizim alanının dışına çıkıldı, çizimi durdur.
                                        return@detectDragGestures
                                    }
                                    if (drawingScreenViewModel.drawingMode.value == DrawingMode.DRAW) {
                                        val line = Line(
                                            start = change.position - dragAmount,
                                            end = change.position,
                                            color = drawingScreenViewModel.brushColor.value,
                                            strokeWidth = drawingScreenViewModel.brushStroke.value
                                        )
                                        lines.add(line)
                                    } else if (drawingScreenViewModel.drawingMode.value == DrawingMode.ERASE) {
                                        val touchPoint = change.position
                                        val iterator = lines.iterator()
                                        while (iterator.hasNext()) {
                                            val line = iterator.next()
                                            if (isPointNearLine(
                                                    touchPoint,
                                                    line.start,
                                                    line.end,
                                                    drawingScreenViewModel.eraserSize.value
                                                )
                                            ) {
                                                iterator.remove()
                                            }
                                        }
                                        drawingScreenViewModel.eraserPosition.value = touchPoint
                                    }
                                },
                                onDragEnd = {
                                    val canvasSize = size
                                    lines.removeAll { line ->
                                        line.start.x < 0f || line.start.x > canvasSize.width || line.start.y < 0f || line.start.y > canvasSize.height ||
                                                line.end.x < 0f || line.end.x > canvasSize.width || line.end.y < 0f || line.end.y > canvasSize.height
                                    }
                                    drawingScreenViewModel.eraserPosition.value = null
                                }
                            )
                        }
                ) {
                    lines.forEach { line ->
                        drawLine(
                            color = line.color,
                            start = line.start,
                            end = line.end,
                            strokeWidth = line.strokeWidth,
                            cap = StrokeCap.Round
                        )
                    }

                    drawingScreenViewModel.eraserPosition.value?.let { eraserPos ->
                        drawCircle(
                            color = Color.Gray.copy(alpha = 0.5f),
                            radius = drawingScreenViewModel.eraserSize.value,
                            center = eraserPos
                        )
                    }
                }
            }
        }

        Column(
            modifier = Modifier
                .fillMaxWidth()
                .weight(2f)
                .padding(8.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(2.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.SpaceEvenly
            ) {
                Row( // Color Picker
                    horizontalArrangement = Arrangement.Center,
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier
                        .fillMaxSize()
                        .weight(1f)
                ) {
                    drawingScreenViewModel.colorOptions.forEach { color ->
                        Box(
                            modifier = Modifier
                                .padding(3.dp)
                                .then(
                                    if (drawingScreenViewModel.brushColor.value == color) {
                                        Modifier.padding(5.dp).background(Color.LightGray, CircleShape)
                                    } else {
                                        Modifier
                                    }
                                )
                        ) {
                            IconButton(
                                onClick = { drawingScreenViewModel.brushColor.value = color },
                            ) {
                                Box(
                                    modifier = Modifier
                                        .size(40.dp)
                                        .background(color, shape = CircleShape)
                                        .border(1.dp, Color.DarkGray, CircleShape)
                                )
                            }
                        }
                    }
                }
                Row( // Bottom row / Save - pen etc.
                    horizontalArrangement = Arrangement.SpaceEvenly,
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier
                        .fillMaxSize()
                        .weight(1f)
                        .padding(2.dp)
                ) {

                    Box(
                        modifier = Modifier
                            .padding(6.dp) // Arkaplanı büyütmek için padding ekliyoruz
                            .then(
                                if (drawingScreenViewModel.drawingMode.value == DrawingMode.DRAW) {
                                    Modifier.background(Color.LightGray, CircleShape)
                                } else {
                                    Modifier
                                }
                            )
                    ) {
                        IconButton( // Pen Mode
                            onClick = {
                                drawingScreenViewModel.drawingMode.value = DrawingMode.DRAW
                            }
                        ) {
                            Icon(Icons.Filled.DriveFileRenameOutline, "Kalem Modu", modifier = Modifier.size(32.dp))
                        }
                    }

                    IconButton( // Stroke
                        onClick = { showStrokePicker = true },
                        modifier = Modifier.padding(6.dp)
                    ) {
                        Box(
                            modifier = Modifier
                                .size(drawingScreenViewModel.brushStroke.value.dp + 10.dp) // Icon boyutunu büyütüyoruz
                                .background(
                                    drawingScreenViewModel.brushColor.value,
                                    shape = CircleShape
                                )
                        )
                    }

                    Button( // Save button
                        onClick = {
                            drawingScreenViewModel.saveImageWithDrawings(
                                context,
                                mainViewModel.photoUri,
                                lines,
                                imageWidthPx,
                                imageHeightPx,
                                cameraViewViewModel.isCameraFront.value,
                                saveDrawings = true
                            )
                        },
                        enabled = drawingScreenViewModel.isButtonEnabled.value,
                        colors = ButtonDefaults.buttonColors(Color.DarkGray),
                        modifier = Modifier.padding(6.dp)
                    ) {
                        Text(text = "Save", fontSize = 20.sp)
                    }

                    Box(
                        modifier = Modifier
                            .padding(6.dp) // Arkaplanı büyütmek için padding ekliyoruz
                            .then(
                                if (drawingScreenViewModel.drawingMode.value == DrawingMode.ERASE) {
                                    Modifier.background(Color.LightGray, CircleShape)
                                } else {
                                    Modifier
                                }
                            )
                    ) {
                        IconButton( // Eraser Mode
                            onClick = {
                                drawingScreenViewModel.drawingMode.value = DrawingMode.ERASE
                            }
                        ) {
                            Image(
                                painter = painterResource(id = R.drawable.rounded_ink_eraser_24),
                                contentDescription = "Silgi Modu",
                                modifier = Modifier.size(32.dp)
                            )
                        }
                    }

                    IconButton( // Eraser Size
                        onClick = { showEraserSizePicker = true },
                        modifier = Modifier.padding(6.dp)
                    ) {
                        Box(
                            modifier = Modifier
                                .size(drawingScreenViewModel.eraserSize.value.dp + 10.dp) // Icon boyutunu büyütüyoruz
                                .background(Color.Gray, shape = CircleShape)
                        )
                    }
                }
            }
        }

        if (showStrokePicker) {
            StrokePickerDialog(
                onStrokeSelected = { selectedStroke ->
                    drawingScreenViewModel.brushStroke.value = selectedStroke
                    showStrokePicker = false
                },
                onDismiss = { showStrokePicker = false }
            )
        }

        if (showEraserSizePicker) {
            StrokePickerDialog(
                onStrokeSelected = { selectedEraserSize ->
                    drawingScreenViewModel.eraserSize.value = selectedEraserSize
                    showEraserSizePicker = false
                },
                onDismiss = { showEraserSizePicker = false }
            )
        }
    }
}

fun isPointNearLine(point: androidx.compose.ui.geometry.Offset, start: androidx.compose.ui.geometry.Offset, end: androidx.compose.ui.geometry.Offset, radius: Float): Boolean {
    val distanceToStart = hypot((point.x - start.x).toDouble(), (point.y - start.y).toDouble())
    val distanceToEnd = hypot((point.x - end.x).toDouble(), (point.y - end.y).toDouble())
    val lineLength = hypot((end.x - start.x).toDouble(), (end.y - start.y).toDouble())
    return distanceToStart + distanceToEnd <= lineLength + radius
}

@Composable
fun StrokePickerDialog(onStrokeSelected: (Float) -> Unit, onDismiss: () -> Unit) {
    Dialog(onDismissRequest = onDismiss) {
        Column(
            modifier = Modifier
                .background(Color.White, shape = RoundedCornerShape(8.dp))
                .padding(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            val strokes = listOf(4f, 8f, 16f, 32f, 64f)

            Text("", style = MaterialTheme.typography.bodyLarge)

            strokes.forEach { stroke ->
                IconButton(
                    onClick = {
                        onStrokeSelected(stroke)
                    },
                    modifier = Modifier
                        .padding(8.dp)
                        .size(40.dp)  // Buton boyutu
                ) {
                    Box(
                        modifier = Modifier
                            .size(stroke.dp)  // Çember boyutu kalem kalınlığına göre ayarlanır
                            .background(Color.Gray, shape = CircleShape)
                    )
                }
            }
        }
    }
}
