package com.mertg.drawcameraapp.view

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.Image
import androidx.compose.foundation.gestures.detectDragGestures
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBackIosNew
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.SubdirectoryArrowLeft
import androidx.compose.material.icons.filled.SubdirectoryArrowRight
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import coil.compose.rememberImagePainter
import com.mertg.drawcameraapp.model.Line
import com.mertg.drawcameraapp.util.getScreenWidthPX
import com.mertg.drawcameraapp.util.photoWidthAndHeightForDisplay
import com.mertg.drawcameraapp.viewmodel.CameraViewViewModel
import com.mertg.drawcameraapp.viewmodel.DrawingScreenViewModel
import com.mertg.drawcameraapp.viewmodel.MainViewModel

@Composable
fun DrawingScreen() {

    val context = LocalContext.current

    val mainViewModel: MainViewModel = viewModel()
    val drawingScreenViewModel : DrawingScreenViewModel = viewModel()

    val cameraViewViewModel : CameraViewViewModel = viewModel()

    val lines = drawingScreenViewModel.lines
    val undoStack = drawingScreenViewModel.undoStack
    val redoStack = drawingScreenViewModel.redoStack

    // real image width and height , like 3000 to 4000
    val (imageWidthToAspectRatio, imageHeightToAspectRatio) = drawingScreenViewModel.getBitmapSizeFromUri(context,mainViewModel.photoUri)

    // send these width and height to make ratio clear, if 9000 16000 returns -> 9:16, 3000 4000 returns->3:4
    val (photoWidthForDisplay,photoHeightForDisplay) = photoWidthAndHeightForDisplay(imageWidthToAspectRatio,imageHeightToAspectRatio)

    val imageWidthPx = getScreenWidthPX()
    val imageHeightPx = imageWidthPx * imageHeightToAspectRatio / imageWidthToAspectRatio

    Column(
        modifier = Modifier.fillMaxSize(),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Row(modifier = Modifier
            .fillMaxWidth()
            .weight(1f),//Geri tuşu sol üst
            verticalAlignment = Alignment.Top,
            horizontalArrangement = Arrangement.Start)
        {
            Column(
                modifier = Modifier.fillMaxSize().weight(1f),
                verticalArrangement = Arrangement.Top,
                horizontalAlignment = Alignment.Start
            ){
                IconButton(
                    onClick = {
                        mainViewModel.goCameraScreen()
                    },
                    modifier = Modifier.padding(3.dp)
                ) {
                    Icon(Icons.Filled.ArrowBackIosNew, "Geri")
                }
            }
            Column(
                modifier = Modifier.fillMaxSize().weight(1f),
                verticalArrangement = Arrangement.Top,
                horizontalAlignment = Alignment.End
            ){
                IconButton(
                    onClick = {
                        drawingScreenViewModel.lines.clear()
                        drawingScreenViewModel.redoStack.clear()
                        drawingScreenViewModel.undoStack.clear()
                    },
                    modifier = Modifier.padding(3.dp)
                ) {
                    Icon(Icons.Filled.Delete, "Delete")
                }
            }
        }

        Row(
            modifier = Modifier
                .width(photoWidthForDisplay)
                .height(photoHeightForDisplay),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.Center
        ) {
            Box(
                modifier = Modifier.fillMaxSize(),
                contentAlignment = Alignment.Center
            ){
                // Resmi göster
                if (cameraViewViewModel.isCameraFront.value) {
                    Image(
                        painter = rememberImagePainter(mainViewModel.photoUri),
                        contentDescription = null,
                        modifier = Modifier
                            .graphicsLayer(
                                scaleX = -1f,
                                scaleY = 1f)
                    )
                }else if(!cameraViewViewModel.isCameraFront.value){
                    Image(
                        painter = rememberImagePainter(mainViewModel.photoUri),
                        contentDescription = null,
                    )
                }



                // Çizimlerin yapıldığı bölge
                Canvas(
                    modifier = Modifier
                        .fillMaxSize()
                        //.border(1.dp, Color.Magenta)
                        .pointerInput(true) {
                            detectDragGestures { change, dragAmount ->
                                change.consume()
                                val line = Line(
                                    start = change.position - dragAmount,
                                    end = change.position,
                                    color = drawingScreenViewModel.brushColor.value, // Kalem rengi
                                    strokeWidth = drawingScreenViewModel.brushStroke.value // Kalem kalınlığı
                                )
                                lines.add(line)
                                undoStack.push(line)
                                redoStack.clear()
                            }
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
                }
            }
        }


        Row( // Whole Bottom Row
            Modifier
                .weight(2f),
            horizontalArrangement = Arrangement.Center,
            verticalAlignment = Alignment.Bottom
        ) {
            Column( // Save to Galery Button / bottom left
                modifier = Modifier
                    .fillMaxSize()
                    .weight(1f),
                verticalArrangement = Arrangement.Center,
                horizontalAlignment = Alignment.CenterHorizontally) {
                Button(
                    onClick = {
                        drawingScreenViewModel.isButtonEnabled.value = false

                        drawingScreenViewModel
                            .saveImageWithDrawings(context,
                                mainViewModel.photoUri,
                                lines,
                                imageWidthPx,
                                imageHeightPx,
                                cameraViewViewModel.isCameraFront.value)
                    },
                    enabled = drawingScreenViewModel.isButtonEnabled.value,
                    colors = ButtonDefaults.buttonColors(Color.DarkGray),
                    modifier = Modifier.padding(3.dp)
                ) {
                    Text(text = "Save", fontSize = 20.sp)
                }
            }
            Column( // Undo and Redo buttons / Bottom right
                modifier = Modifier
                    .fillMaxSize()
                    .weight(1f),
                verticalArrangement = Arrangement.Center,
                horizontalAlignment = Alignment.CenterHorizontally
            ) {

                Row( // Row for Undo and Redo
                    modifier = Modifier.fillMaxSize(),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.Center
                ) {
                    IconButton( // Undo button / Left
                        onClick = {
                            drawingScreenViewModel.undoLastDrawing()
                            drawingScreenViewModel.undoLastDrawing()
                            drawingScreenViewModel.undoLastDrawing()
                        },
                        modifier = Modifier
                            .weight(1f)
                            .graphicsLayer(
                                scaleX = 1f,
                                scaleY = -1f  // Horizontal Flip
                            )
                    ) {
                        Icon(Icons.Filled.SubdirectoryArrowLeft, "Undo Draw")
                    }
                    IconButton( // Undo button / Right
                        onClick = {
                            drawingScreenViewModel.redoLastDrawing()
                            drawingScreenViewModel.redoLastDrawing()
                            drawingScreenViewModel.redoLastDrawing()
                        },
                        modifier = Modifier
                            .weight(1f)
                            .graphicsLayer(
                                scaleX = 1f,
                                scaleY = -1f  // Horizontal Flip
                            )
                    ) {
                        Icon(Icons.Filled.SubdirectoryArrowRight, "Redo Draw")
                    }
                }
            }
        }
    }
}