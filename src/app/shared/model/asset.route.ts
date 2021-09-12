export class RouteRequest {
  constructor(
    public points: Array<Array<number>>,
    public forceFit: boolean,
    public forceFollow: boolean
  ) {
  }

  firstPoint(): Array<number> {
    return this.points[0]
  }

  lastPoint(): Array<number> {
    return this.points[this.points.length -1]
  }
}

export class AssetRoute {
  constructor(
    public asset: string,
    public route: RouteRequest
  ) {
  }

  firstPoint(): Array<number> {
    return this.route.firstPoint()
  }

  lastPoint(): Array<number> {
    return this.route.lastPoint()
  }
}

export class ZoomAt {
  constructor(
    public asset: string,
    public points: Array<Array<number>>
  ) {
  }
}
