import { NextRequest, NextResponse } from "next/server";
import { createMarketingCampaign, getMarketingCampaigns } from "@/lib/cosmic";
import { CreateCampaignData } from "@/types";

export async function GET() {
  try {
    const campaigns = await getMarketingCampaigns();

    return NextResponse.json({
      success: true,
      data: campaigns,
    });
  } catch (error) {
    console.error("Campaigns fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch campaigns" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, template_id, list_ids, subject, content } =
      await request.json();

    console.log("Creating campaign with data:", {
      name,
      template_id,
      list_ids,
    });

    // Validate required fields
    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "Campaign name is required" },
        { status: 400 }
      );
    }

    if (!subject || !content) {
      return NextResponse.json(
        { error: "Subject and content are required" },
        { status: 400 }
      );
    }

    if (!list_ids || list_ids.length === 0) {
      return NextResponse.json(
        { error: "At least one list is required" },
        { status: 400 }
      );
    }

    // Create campaign with campaign_content (no template reference)
    const campaign = await createMarketingCampaign({
      name,
      template_id, // Only used to copy content, not stored
      list_ids,
      subject,
      content,
    });

    console.log("Campaign created successfully:", campaign.id);

    return NextResponse.json({
      success: true,
      message: "Campaign created successfully",
      data: campaign,
    });
  } catch (error: any) {
    console.error("Campaign creation error:", error);

    return NextResponse.json(
      {
        error: "Failed to create campaign",
        details: error.message || "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
