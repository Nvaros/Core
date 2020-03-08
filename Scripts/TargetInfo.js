KillAura = Java.type("net.ccbluex.liquidbounce.LiquidBounce").moduleManager.getModule(Java.type("net.ccbluex.liquidbounce.features.module.modules.combat.KillAura").class);
EntityPlayer = Java.type("net.minecraft.entity.player.EntityPlayer");
StringUtils = Java.type("net.minecraft.util.StringUtils");
Gui = Java.type("net.minecraft.client.gui.Gui");
GL11 = Java.type("org.lwjgl.opengl.GL11");
Color = Java.type("java.awt.Color");

Fonts = Java.type("net.ccbluex.liquidbounce.ui.font.Fonts");
FontList = Fonts.getFonts();

var font
var ii


list = [
    BGRed = value.createInteger("BGRed", 0, 0, 255),
    BGGreen = value.createInteger("BGGreen", 0, 0, 255),
    BGBlue = value.createInteger("BGBlue", 0, 0, 255),
    BGAlpha = value.createInteger("BGAlpha", 150, 0, 255),
    x = value.createInteger("X", 415, 0, 1000),
    y = value.createInteger("Y", 320, 0, 1000),
    FontValue = value.createInteger('', 0, 0, FontList.length - 1),
    Font = value.createText('Font ', Fonts.getFonts()[0].getDefaultFont().getFont().getName()),
    TextY = value.createFloat('TextY', 0, -5, 5),
    ShadowText = value.createBoolean('ShadowText', true),
    TextRed = value.createInteger("TextRed", 255, 0, 255),
    TextGreen = value.createInteger("TextGreen", 255, 0, 255),
    TextBlue = value.createInteger("TextBlue", 255, 0, 255)
]

module = {
    name: "TargetInfo",
    description: "Renders informations about current target.",
    author: "natte && As丶One",
    values: list,
    onRender2D: function () {
        var BGColor = new Color(BGRed.get(), BGGreen.get(), BGBlue.get(), BGAlpha.get()).getRGB()
        var TextColor = new Color(TextRed.get(),TextGreen.get(),TextBlue.get()).getRGB()

        if (mc.thePlayer != null && KillAura.target instanceof EntityPlayer) {
            var playerInfo = mc.getNetHandler().getPlayerInfo(KillAura.target.getUniqueID());

            var name = StringUtils.stripControlCodes(KillAura.target.getName());
            var distance = mc.thePlayer.getDistanceToEntity(KillAura.target).toFixed(2);
            var health = (KillAura.target.getHealth() / 2).toFixed(2);
            var ping = playerInfo == null ? "0ms" : playerInfo.getResponseTime() + "ms";

            var width = 140;
            var height = 44;

            drawRect(x.get(), y.get(), width, height, BGColor);
            if(ShadowText.get()){
                font.drawStringWithShadow("Name: " + name, x.get() + 46.5, y.get() + 4 + TextY.get(),TextColor);
                font.drawStringWithShadow("Distance: " + distance, x.get() + 46.5, y.get() + 12 + TextY.get(),TextColor);
                font.drawStringWithShadow("Health: " + health, x.get() + 46.5, y.get() + 20 + TextY.get(),TextColor);
                font.drawStringWithShadow("Ping: " + ping, x.get() + 46.5, y.get() + 28 + TextY.get(),TextColor);
            }else{
                font.drawString("Name: " + name, x.get() + 46.5, y.get() + 4 + TextY.get(), TextColor);
                font.drawString("Distance: " + distance, x.get() + 46.5, y.get() + 12 + TextY.get(), TextColor);
                font.drawString("Health: " + health, x.get() + 46.5, y.get() + 20 + TextY.get(), TextColor);
                font.drawString("Ping: " + ping, x.get() + 46.5, y.get() + 28 + TextY.get(), TextColor);
            }
            

            drawFace(x.get() + 0.5, y.get() + 0.5, 8, 8, 8, 8, 44, 44, 64, 64);

            var inc = 96 / KillAura.target.getMaxHealth();
            var end = inc * (KillAura.target.getHealth() > KillAura.target.getMaxHealth() ? KillAura.target.getMaxHealth() : KillAura.target.getHealth());

            drawRect(x.get() + 44, y.get() + 36, width - 44, height - 35.5, new Color(35, 35, 35).getRGB());
            drawRect(x.get() + 44, y.get() + 36, end, height - 35.5, getHealthColor(KillAura.target));
        }
    },
    onUpdate: function () {
        if (ii != FontValue.get()) {
            ii = FontValue.get()
            font = Fonts.getFonts()[ii]
            Font.set(font == mc.fontRendererObj ? 'Minecraft' : font.getDefaultFont().getFont().getName())
        }
    },
    onEnable: function () {
        ii = FontValue.get()
        font = FontList[ii]
        Font.set(font == mc.fontRendererObj ? 'Minecraft' : font.getDefaultFont().getFont().getName())
    }
}

function drawFace(x, y, u, v, uWidth, vHeight, width, height, tileWidth, tileHeight) {
    var texture = KillAura.target.getLocationSkin();

    mc.getTextureManager().bindTexture(texture);

    GL11.glEnable(GL11.GL_BLEND);
    GL11.glColor4f(1, 1, 1, 1);

    Gui.drawScaledCustomSizeModalRect(x, y, u, v, uWidth, vHeight, width, height, tileWidth, tileHeight);

    GL11.glDisable(GL11.GL_BLEND);
}

function drawRect(x, y, width, height, color) {
    Gui.drawRect(x, y, x + width, y + height, color);
}

function getHealthColor(player) {
    var health = player.getHealth();
    var maxHealth = player.getMaxHealth();

    return Color.HSBtoRGB(Math.max(0.0, Math.min(health, maxHealth) / maxHealth) / 3.0, 1.0, 0.75) | 0xFF000000;
}

script.import("Core.lib");
