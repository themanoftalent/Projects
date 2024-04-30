package com.mertg.drawcameraapp.util

import android.content.Context
import android.graphics.Bitmap
import android.graphics.Matrix
import android.media.ExifInterface
import android.net.Uri
import androidx.compose.runtime.Composable
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.times


fun rotateImageIfRequired(context: Context, bitmap: Bitmap, uri: Uri): Bitmap {
    val inputStream = context.contentResolver.openInputStream(uri)
    val ei = ExifInterface(inputStream!!)
    val orientation: Int = ei.getAttributeInt(
        ExifInterface.TAG_ORIENTATION,
        ExifInterface.ORIENTATION_UNDEFINED
    )

    val rotatedBitmap: Bitmap
    rotatedBitmap = when (orientation) {
        ExifInterface.ORIENTATION_ROTATE_90 -> rotateImage(bitmap, 90f)
        ExifInterface.ORIENTATION_ROTATE_180 -> rotateImage(bitmap, 180f)
        ExifInterface.ORIENTATION_ROTATE_270 -> rotateImage(bitmap, 270f)
        ExifInterface.ORIENTATION_NORMAL -> bitmap
        else -> bitmap
    }
    inputStream.close()
    return rotatedBitmap
}

fun rotateImage(source: Bitmap, angle: Float): Bitmap {
    val matrix = Matrix()
    matrix.postRotate(angle)
    return Bitmap.createBitmap(source, 0, 0, source.width, source.height, matrix, true)
}


@Composable
fun getCurrentContext() : Context {
    return LocalContext.current
}

@Composable
fun getCurrentDensity() : Float {
    return LocalDensity.current.density
}

@Composable
fun getScreenWidthDP() : Dp {
    val context = getCurrentContext()
    val density = getCurrentDensity()

    val screenWidthPixels = context.resources.displayMetrics.widthPixels
    val screenWidthDp = (screenWidthPixels / density).dp

    return screenWidthDp
}

@Composable
fun getScreenHeightDP() : Dp {
    val context = getCurrentContext()
    val density = getCurrentDensity()

    val screenHeightPixels = context.resources.displayMetrics.heightPixels
    val screenHeightDp = (screenHeightPixels / density).dp

    return screenHeightDp
}

@Composable
fun getScreenWidthPX() : Int {
    val context = getCurrentContext()
    val density = getCurrentDensity()

    val screenWidthPixels = context.resources.displayMetrics.widthPixels

    return screenWidthPixels
}

@Composable
fun getScreenHeightPX() : Int {
    val context = getCurrentContext()
    val density = getCurrentDensity()

    val screenHeightPixels = context.resources.displayMetrics.heightPixels

    return screenHeightPixels
}

@Composable
fun photoWidthAndHeightForDisplay(photoRatioWidth : Int, photoRatioHeight : Int): Pair<Dp, Dp> {
    var photoWidthForDisplayDP = getScreenWidthDP()
    var photoHeightForDisplayDP = photoWidthForDisplayDP * photoRatioHeight / photoRatioWidth

    return Pair(photoWidthForDisplayDP,photoHeightForDisplayDP)
}

@Composable
fun photoWidthAndHeightForDisplayWithPadding(photoRatioWidth : Int, photoRatioHeight : Int, paddingValue :Dp): Pair<Dp, Dp> {
    var photoWidthForDisplayDP = getScreenWidthDP() - (2 * paddingValue)
    var photoHeightForDisplayDP = photoWidthForDisplayDP * photoRatioHeight / photoRatioWidth

    return Pair(photoWidthForDisplayDP,photoHeightForDisplayDP)
}


/*
useful to save normal image, without lines.
private fun saveDrawingOnly(lines: List<Line>, context: Context) {
    // Create a blank bitmap to draw the lines on
    val bitmap = Bitmap.createBitmap(
        context.resources.displayMetrics.widthPixels, // Width of the bitmap
        context.resources.displayMetrics.heightPixels, // Height of the bitmap
        Bitmap.Config.ARGB_8888 // Bitmap configuration
    )

    // Create a canvas to draw on the bitmap
    val canvas = android.graphics.Canvas(bitmap)

    // Draw each line on the canvas
    val paint = Paint().apply {
        isAntiAlias = true
        color = Color.Black.toArgb() // Çizim rengi
        strokeWidth = 5f // Kalem kalınlığı
        style = Paint.Style.STROKE
    }
    lines.forEach { line ->
        canvas.drawLine(line.start.x, line.start.y, line.end.x, line.end.y, paint)
    }

    // Save the bitmap to the device storage
    val fileName = "drawing_${System.currentTimeMillis()}.png"
    val fileOutputStream: FileOutputStream
    try {
        fileOutputStream = context.openFileOutput(fileName, Context.MODE_PRIVATE)
        bitmap.compress(Bitmap.CompressFormat.PNG, 100, fileOutputStream)
        fileOutputStream.close()
        Toast.makeText(context, "Çizim kaydedildi.", Toast.LENGTH_SHORT).show()
    } catch (e: Exception) {
        e.printStackTrace()
        Toast.makeText(context, "Çizim kaydedilirken bir hata oluştu.", Toast.LENGTH_SHORT).show()
    }
}
*/



