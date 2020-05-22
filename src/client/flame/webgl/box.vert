#version 300 es

// Box data. x/y positions, x in 0-1 percentages of the total height and y in
// pixels, and then the graph ID followed by a categorization (model's Category)
in vec4 boxes;

// (x1, y1, x2, y2) bounds of the canvas in pixels
uniform vec4 bounds;

// current hovered graph ID, or -1
uniform int hovered;

// current focused graph ID, or -1
uniform int focused;

// color of focused elements
uniform vec4 focus_color;

out vec4 v_color;

// murmur3's 32-bit finalizer, which we use as a simple and fast hash function:
int hash(int h) {
  h ^= h >> 16;
  h *= 2246822507;
  h ^= h >> 13;
  h *= 3266489909;
  h ^= h >> 16;

  return h;
}

void main() {
  float range_x = bounds[2] - bounds[0];
  float range_y = bounds[3] - bounds[1];
  gl_Position = vec4(
    (boxes[0] - bounds[0]) / range_x * 2.0 - 1.0,
    (boxes[1] - bounds[1]) / range_y * -2.0 + 1.0,
    0,
    1
  );

  mediump int graph_id = int(boxes[2]);
  mediump int color_hash = hash(graph_id); // djb2's prime, just some bogus stuff
  lowp int categorization = int(boxes[3]);
  if (focused == graph_id) {
    v_color = focus_color;
  } else if (categorization == 0) {
    v_color = vec4(0.6, 0.6, 0.6, 1);
  } else {
    v_color = vec4(0.9, float(color_hash & 255) / 512.0, float((color_hash >> 8) & 255) / 600.0, 1);
  }

  if (hovered == graph_id) {
    v_color *= 0.8;
  }
}
