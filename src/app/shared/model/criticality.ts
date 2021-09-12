export enum Criticality {
  Low= "Low",
  Normal = "Normal",
  High = "High",
  Extreme = "Extreme"
}

export class CriticalityUtil {
  static criticalityColor: Map<Criticality, string> = new Map<Criticality, string>([
    [Criticality.Low, "green"],
    [Criticality.Normal, "gray"],
    [Criticality.High, "yellow"],
    [Criticality.Extreme, "red"]
  ])

  static criticalityTitle: Map<Criticality, string> = new Map<Criticality, string>([
    [Criticality.Low, "Low"],
    [Criticality.Normal, "Normal"],
    [Criticality.High, "Medium"],
    [Criticality.Extreme, "Critical"]
  ])

  static criticalityLevel: Map<Criticality, number> = new Map<Criticality, number>([
    [Criticality.Low, 0],
    [Criticality.Normal, 1],
    [Criticality.High, 2],
    [Criticality.Extreme, 3]
  ])

  static fgColors: Map<Criticality, string> = new Map<Criticality, string>([
    [Criticality.Low, "212121"],
    [Criticality.Normal, "212121"],
    [Criticality.High, "F4F4F4"],
    [Criticality.Extreme, "F4F4F4"]
  ])

  static bgColors: Map<Criticality, string> = new Map<Criticality, string>([
    [Criticality.Low, "f4f4f4"],
    [Criticality.Normal, "f4f4f4"],
    [Criticality.High, "DCAF00"],
    [Criticality.Extreme, "DC2D37"]
  ])

  static styleColor(c: Criticality): string {
    return this.criticalityColor.get(c)
  }

  static title(c: Criticality): string {
    return this.criticalityTitle.get(c)
  }

  static level(c: Criticality): number {
    return this.criticalityLevel.get(c)
  }

  static style(c: Criticality): string {
    return `<i class="bi bi-circle-fill color-${this.styleColor(c)}"></i>`
  }

  static eventIconStyle(c: Criticality): string {
    return `bi bi-exclamation-triangle-fill color-${this.styleColor(c)}`;
  }

  static mapIconFGColor(c: Criticality): string {
    return this.fgColors.get(c)
  }

  static mapIconBGColor(c: Criticality): string {
    return this.bgColors.get(c)
  }
}
