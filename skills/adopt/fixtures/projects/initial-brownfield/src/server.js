export function handleOrder(request) {
  if (!request?.orderId) return { status: 400, body: { error: "orderId required" } };
  return { status: 200, body: { accepted: request.orderId } };
}
