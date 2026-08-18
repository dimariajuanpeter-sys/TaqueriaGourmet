/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { withSupabase } from "@supabase/server";

/**
 * 1. Public Endpoint - No Authentication Required
 * Returns API health check and server time.
 */
export const healthHandler = {
  fetch: withSupabase({ auth: "none" }, async (_req, _ctx) => {
    return Response.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      service: "Panchería Gourmet API"
    });
  })
};

/**
 * 2. Publishable Endpoint - Anon Client (Publishable Key Gated)
 * Exposes public products catalog. RLS policies apply.
 */
export const getCatalogHandler = {
  fetch: withSupabase({ auth: "publishable" }, async (_req, ctx) => {
    // ctx.supabase is initialized as anonymous; RLS is the source of truth.
    const { data: products, error } = await (ctx.supabase as any)
      .from("products")
      .select("*")
      .eq("disponible", true);

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json(products);
  })
};

/**
 * 3. Authenticated Endpoint - User JWT Required
 * Fetches the authenticated user's orders. RLS-scoped to the user.
 */
export const getUserOrdersHandler = {
  fetch: withSupabase({ auth: "user" }, async (_req, ctx) => {
    // ctx.supabase is automatically scoped to the user JWT.
    // RLS will enforce that this user only sees their own orders.
    const { data: orders, error } = await (ctx.supabase as any)
      .from("orders")
      .select(`
        *,
        order_items (
          *,
          products (*),
          order_sauces (
            sauces (*)
          )
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json(orders);
  })
};

/**
 * 4. Admin Endpoint - Secret Key Required (Bypasses RLS)
 * Updates the state of an order using service_role permissions.
 */
export const updateOrderAdminHandler = {
  fetch: withSupabase({ auth: "secret" }, async (req, ctx) => {
    // Bypasses RLS using the admin client.
    try {
      const { orderId, nuevoEstado } = await req.json() as { orderId: string; nuevoEstado: string };

      if (!orderId || !nuevoEstado) {
        return Response.json({ error: "orderId and nuevoEstado are required" }, { status: 400 });
      }

      const { data: updatedOrder, error } = await (ctx.supabaseAdmin as any)
        .from("orders")
        .update({ estado: nuevoEstado })
        .eq("id", orderId)
        .select()
        .single();

      if (error) {
        return Response.json({ error: error.message }, { status: 500 });
      }

      return Response.json({
        message: "Order status updated successfully by administrator",
        order: updatedOrder
      });
    } catch (err: any) {
      return Response.json({ error: err.message || "Invalid payload" }, { status: 400 });
    }
  })
};

/**
 * 5. Dual Authentication Endpoint - Accepts either User JWT or Secret Admin Key
 * Fetches specific order details.
 */
export const getOrderDetailHandler = {
  fetch: withSupabase({ auth: ["user", "secret"] }, async (req, ctx) => {
    const url = new URL(req.url);
    const orderId = url.searchParams.get("id");

    if (!orderId) {
      return Response.json({ error: "Missing order id" }, { status: 400 });
    }

    if (ctx.authMode === "secret") {
      // Admin path - bypasses RLS
      const { data: order, error } = await (ctx.supabaseAdmin as any)
        .from("orders")
        .select("*")
        .eq("id", orderId)
        .single();

      if (error) return Response.json({ error: error.message }, { status: 500 });
      return Response.json(order);
    } else {
      // User path - RLS scoped
      const { data: order, error } = await (ctx.supabase as any)
        .from("orders")
        .select("*")
        .eq("id", orderId)
        .single();

      if (error) return Response.json({ error: error.message }, { status: 500 });
      return Response.json(order);
    }
  })
};
